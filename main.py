import os
import json
import requests
import calendar
from flask_cors import CORS
from selenium import webdriver
from dotenv import load_dotenv
from flask import Flask, jsonify
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By

app = Flask(__name__)
CORS(app)
load_dotenv()

API_KEY = os.getenv("RENDER_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
CRON_API_KEY = os.getenv("CRON_API_KEY")
BASE_URL = "https://api.render.com/v1"
TAVILY_BASE_URL = "https://api.tavily.com"
CRON_BASE_URL = "https://api.cron-job.org"


if not API_KEY and not TAVILY_API_KEY:
    print("No API key found!")
else:
    print("API key found!")


def save_cache(data):
    with open("cache.json", "w") as f:
        json.dump(data, f)


def load_cache():
    if not os.path.exists("cache.json"):
        return {"last_synced_at": None, "hosting": {}, "apis": [], "projects": []}
    with open("cache.json") as f:
        return json.load(f)


def left_time(token: int):
    now = datetime.now()
    last_sync_info = (now + timedelta(seconds=19800)).isoformat()
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    time_left = end_of_day - now
    if token == 1:
        return int(time_left.total_seconds())
    else:
        return last_sync_info


def get_renewal_date():
    now = datetime.now()
    last_day = calendar.monthrange(now.year, now.month)[1]
    renewal = datetime(now.year, now.month, last_day)
    return renewal.strftime("%Y-%m-%d")


def get_history(job_id):
    headers = {
        "Authorization": f"Bearer {CRON_API_KEY}",
        "Content-Type": "application/json",
    }
    response = requests.get(f"{CRON_BASE_URL}/jobs/{job_id}/history", headers=headers, timeout=10).json()
    return {"date": response["history"][0].get("date", None), "duration": response["history"][0].get("duration", None),
            "jitter": response["history"][0].get("jitter", None),
            "status": response["history"][0].get("httpStatus", None), "httpStatus": None}


def check_cron_jobs():
    headers = {
        "Authorization": f"Bearer {CRON_API_KEY}",
        "Content-Type": "application/json",
    }
    response = requests.get(f"{CRON_BASE_URL}/jobs", headers=headers, timeout=10).json()
    services = response["jobs"]
    data = []
    for resp in services:
        data.append({"name": resp.get("title", None),
                     "job_id": resp.get("jobId", None),
                     "status": resp.get("enabled", None),
                     "last_duration": resp.get("duration", None),
                     "last_execution": resp.get("lastExecution", None),
                     "next_execution": resp.get("nextExecution", None),
                     "history": get_history(resp.get("jobId", None))
                     })

    return {"cron_jobs": data}


def check_tavily():
    headers = {
        "Authorization": f"Bearer {TAVILY_API_KEY}",
        "Content-Type": "application/json"
    }

    response_tavily = requests.get(f"{TAVILY_BASE_URL}/usage", headers=headers, timeout=10).json()
    plan_usage = response_tavily.get("account", {}).get("plan_usage", "None")
    plan_limit = response_tavily.get("account", {}).get("plan_limit", "None")

    return {"name": "Tavily api", "used": plan_usage, "total": plan_limit, "resets_in_seconds": left_time(1)}


def check_groq():
    return {"name": "Groq api", "used": 609, "total": 1000, "resets_in_seconds": left_time(1)}


def check_render():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    error = 0
    projects = []
    response = requests.get(f"{BASE_URL}/services", headers=headers, timeout=10)

    if response.status_code == 200:
        services = response.json()
        for item in services:
            service = item["service"]
            projects.append({
                "name": service["name"],
                "type": service["type"],
                "is_online": get_status(service["id"])['is_online'],
                "render_url": get_status(service["id"])['render_url'],
                "plan": get_status(service["id"])['plan']
            })
    else:
        error = response.status_code

    return projects if response.status_code == 200 else error


def get_status(service_id):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    service = requests.get(f"{BASE_URL}/services/{service_id}", headers=headers, timeout=10).json()
    deploys = requests.get(f"{BASE_URL}/services/{service_id}/deploys", headers=headers, timeout=10).json()

    status = deploys[0].get("deploy", {}).get("status", "unknown").lower() if deploys else "unknown"

    return {
        "is_online": status == "live",
        "render_url": service.get("dashboardUrl", ""),
        "plan": service.get("serviceDetails", {}).get("plan", "None")
    }

API_TOTAL = [check_tavily, check_groq()]
@app.route("/api/sync", methods=['POST'])
def sync_dashboard():
    apis = {
        "last_synced_at": None,
        "hosting": {
            "hours_used": None,
            "hours_total": None,
            "renews_on": "0000-00-00"
        },
        "apis": [],
        "projects": None
    }
    try:
        apis = {
            "last_synced_at": left_time(2),
            "hosting": {
                "hours_used": 500,
                "hours_total": 750,
                "renews_on": get_renewal_date()
                },
            "apis": [item() for item in API_TOTAL],
            "projects": check_render()
        }
    except Exception as e:
        print(f"Error: {e}")

    save_cache(apis)
    return jsonify(apis), 200


@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    data = load_cache()
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)
