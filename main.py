import os
import json
import requests
from datetime import datetime
from selenium import webdriver
from dotenv import load_dotenv
from flask import Flask, jsonify
from selenium.webdriver.common.by import By

app = Flask(__name__)
load_dotenv()

API_KEY = os.getenv("RENDER_API_KEY")
BASE_URL = "https://api.render.com/v1"


def save_cache(data):
    with open("cache.json", "w") as f:
        json.dump(data, f)


def load_cache():
    if not os.path.exists("cache.json"):
        return {"last_synced_at": None, "hosting": {}, "apis": [], "projects": []}
    with open("cache.json") as f:
        return json.load(f)


if not API_KEY:
    print("No API key found!")
else:
    print("API key found!")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    data = load_cache()
    return jsonify(data), 200


def get_status(service_id):
    service = requests.get(f"{BASE_URL}/services/{service_id}", headers=headers, timeout=10).json()
    deploys = requests.get(f"{BASE_URL}/services/{service_id}/deploys", headers=headers, timeout=10).json()

    status = deploys[0].get("deploy", {}).get("status", "unknown").lower() if deploys else "unknown"

    return {
        "is_online": status == "live",
        "render_url": service.get("dashboardUrl", ""),
        "plan": service.get("serviceDetails", {}).get("plan", "Unknown")
    }


@app.route("/api/sync", methods=['POST'])
def sync_dashboard():
    last_sync_info = datetime.now().isoformat()
    projects = []
    response = requests.get(f"{BASE_URL}/services", headers=headers, timeout=10)
    if response.status_code == 200:
        services = response.json()
        for item in services:
            service = item["service"]
            projects.append({
                "name": service["name"],
                "type": service["type"],
                "is_online": get_status(service["id"]),
                "render_url": get_status(service["id"]),
                "plan": get_status(service["id"])
            })
    else:
        print("Error:", response.status_code, response.text)

    data = {
        "last_synced_at": last_sync_info,
        "hosting": {},
        "apis": [],
        "projects": projects
    }

    save_cache(data)
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)
