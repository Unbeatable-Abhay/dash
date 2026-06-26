import os
import json
import requests
import calendar
from datetime import datetime
from selenium import webdriver
from dotenv import load_dotenv
from flask import Flask, jsonify
from selenium.webdriver.common.by import By

app = Flask(__name__)
load_dotenv()

API_KEY = os.getenv("RENDER_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
# OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
BASE_URL = "https://api.render.com/v1"
TAVILY_BASE_URL = "https://api.tavily.com"
# OPEN_ROUTER_BASE_URL = "https://openrouter.ai/api/v1"


if not API_KEY and not TAVILY_API_KEY:
    print("No API key found!")
else:
    print("API key found!")


headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }


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
    last_sync_info = now.isoformat()
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


def check_tavily():
    headers = {
        "Authorization": f"Bearer {TAVILY_API_KEY}",
        "Content-Type": "application/json"
    }

    response_tavily = requests.get(f"{TAVILY_BASE_URL}/usage", headers=headers, timeout=10).json()
    plan_usage = response_tavily.get("account", {}).get("plan_usage", "None")
    plan_limit = response_tavily.get("account", {}).get("plan_limit", "None")

    return {"name": "Tavily api", "used": plan_usage, "total": plan_limit, "resets_in_seconds": left_time(1)}


# def check_openrouter():
#     headers = {
#         "Authorization": f"Bearer {OPEN_ROUTER_API_KEY}",
#         "Content-Type": "application/json"
#     }
#
#     response = requests.get(f"{OPEN_ROUTER_BASE_URL}/credits", headers=headers, timeout=10)
#     print(response.headers)


def check_render():
    projects = []
    error = 0
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
    service = requests.get(f"{BASE_URL}/services/{service_id}", headers=headers, timeout=10).json()
    deploys = requests.get(f"{BASE_URL}/services/{service_id}/deploys", headers=headers, timeout=10).json()

    status = deploys[0].get("deploy", {}).get("status", "unknown").lower() if deploys else "unknown"

    return {
        "is_online": status == "live",
        "render_url": service.get("dashboardUrl", ""),
        "plan": service.get("serviceDetails", {}).get("plan", "None")
    }

API_TOTAL = [check_tavily]
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
                "hours_used": 497.57,
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
