import os
import json
import requests
import calendar
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
CORS(app)
load_dotenv()

API_KEY = os.getenv("RENDER_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
CRON_API_KEY = os.getenv("CRON_API_KEY")
BASE_URL = "https://api.render.com/v1"
TAVILY_BASE_URL = "https://api.tavily.com"
CRON_BASE_URL = "https://api.cron-job.org"

IST = timezone(timedelta(hours=5, minutes=30))
HISTORY_DEPTH = 10

if not API_KEY and not TAVILY_API_KEY and not CRON_API_KEY:
    print("No API key found!")
else:
    print("API key found!")


def save_cache(data):
    with open("cache.json", "w") as f:
        json.dump(data, f)


def load_cache():
    if not os.path.exists("cache.json"):
        return {"last_synced_at": None, "hosting": {}, "apis": [], "projects": [], "monitor": []}
    with open("cache.json") as f:
        return json.load(f)


def seconds_until_midnight():
    now = datetime.now()
    end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999)
    return int((end_of_day - now).total_seconds())


def current_timestamp_ist():
    return datetime.now(IST).isoformat()


def get_renewal_date():
    now = datetime.now()
    last_day = calendar.monthrange(now.year, now.month)[1]
    renewal = datetime(now.year, now.month, last_day)
    return renewal.strftime("%Y-%m-%d")


def to_ist(unix_seconds):
    """Convert a Unix epoch (UTC) timestamp to an ISO string in IST.
    Returns None if the input is missing or invalid."""
    if not unix_seconds:
        return None
    try:
        utc_dt = datetime.fromtimestamp(unix_seconds, tz=timezone.utc)
        return utc_dt.astimezone(IST).isoformat()
    except (ValueError, OSError, TypeError):
        return None


def format_duration(seconds):
    """Formats raw seconds as e.g. '4m 0s'. Never treat this as a date."""
    if seconds is None:
        return None
    seconds = int(seconds)
    minutes, secs = divmod(seconds, 60)
    return f"{minutes}m {secs}s" if minutes else f"{secs}s"


def compute_health_status(history_list):
    """Returns 'success', 'warning', 'danger', or 'unknown'.

    First-pass heuristic, not a tuned/verified threshold set — revisit once
    real data has been observed for a while:
    - danger: 2+ of the last 5 runs failed
    - warning: most recent run failed once, OR its duration is 3x+ the
      recent average (likely cold start)
    - success: otherwise
    """
    if not history_list:
        return "unknown"

    latest = history_list[0]
    latest_failed = (latest.get("status") is not None and latest.get("status") < 0) or (
            latest.get("httpStatus") is not None and latest.get("httpStatus") >= 400
    )

    if latest_failed:
        recent_failures = sum(
            1 for h in history_list[:5]
            if (h.get("status") is not None and h.get("status") < 0)
            or (h.get("httpStatus") is not None and h.get("httpStatus") >= 400)
        )
        return "danger" if recent_failures >= 2 else "warning"

    durations = [h.get("duration") for h in history_list[1:6] if h.get("duration")]
    latest_duration = latest.get("duration")
    if durations and latest_duration:
        avg = sum(durations) / len(durations)
        if avg > 0 and latest_duration > avg * 3:
            return "warning"

    return "success"


def get_history(job_id):
    """Returns up to HISTORY_DEPTH past executions for a job, newest first.
    Never crashes on a job with no history yet."""
    headers = {
        "Authorization": f"Bearer {CRON_API_KEY}",
        "Content-Type": "application/json",
    }
    response = requests.get(f"{CRON_BASE_URL}/jobs/{job_id}/history", headers=headers, timeout=10).json()

    raw_history = response.get("history", [])[:HISTORY_DEPTH]
    if not raw_history:
        return []

    return [
        {
            "date": to_ist(entry.get("date")),
            "duration": entry.get("duration"),
            "duration_formatted": format_duration(entry.get("duration")),
            "jitter": entry.get("jitter"),
            "status": entry.get("status"),
            "http_status": entry.get("httpStatus"),
        }
        for entry in raw_history
    ]


def check_cron_jobs():
    headers = {
        "Authorization": f"Bearer {CRON_API_KEY}",
        "Content-Type": "application/json",
    }
    response = requests.get(f"{CRON_BASE_URL}/jobs", headers=headers, timeout=10).json()
    jobs = response.get("jobs", [])

    data = []
    for job in jobs:
        job_id = job.get("jobId")
        history = get_history(job_id) if job_id else []

        data.append({
            "name": job.get("title"),
            "job_id": job_id,
            "is_enabled": job.get("enabled"),
            "health_status": compute_health_status(history),
            "last_execution": to_ist(job.get("lastExecution")),
            "next_execution": to_ist(job.get("nextExecution")),
            "last_duration_formatted": format_duration(job.get("duration")),
            "history": history,
        })

    return data


def check_tavily():
    headers = {
        "Authorization": f"Bearer {TAVILY_API_KEY}",
        "Content-Type": "application/json"
    }
    response_tavily = requests.get(f"{TAVILY_BASE_URL}/usage", headers=headers, timeout=10).json()
    plan_usage = response_tavily.get("account", {}).get("plan_usage", None)
    plan_limit = response_tavily.get("account", {}).get("plan_limit", None)

    return {"name": "Tavily api", "used": plan_usage, "total": plan_limit,
            "resets_in_seconds": seconds_until_midnight()}


def check_groq():
    return {"name": "Groq api", "used": 609, "total": 1000, "resets_in_seconds": seconds_until_midnight()}


def check_gemini():
    return {"name": "Gemini api", "used": 1000, "total": 1000, "resets_in_seconds": seconds_until_midnight()}


def check_cerebras():
    return {"name": "Cerebras api", "used": 609, "total": 1000, "resets_in_seconds": seconds_until_midnight()}


API_TOTAL = [check_tavily, check_groq, check_gemini, check_cerebras]


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
        "render_url": service.get("dashboardUrl", None),
        "plan": service.get("serviceDetails", {}).get("plan", "None")
    }


def check_render():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.get(f"{BASE_URL}/services", headers=headers, timeout=10)

    if response.status_code != 200:
        raise RuntimeError(f"Render API returned {response.status_code}")

    services = response.json()
    projects = []
    for item in services:
        service = item["service"]
        status_info = get_status(service["id"])
        projects.append({
            "name": service["name"],
            "type": service["type"],
            "is_online": status_info["is_online"],
            "render_url": status_info["render_url"],
            "plan": status_info["plan"]
        })
    return projects


@app.route("/api/sync", methods=['POST'])
def sync_dashboard():
    cached = load_cache()
    try:
        hosting = {
            "hours_used": 517.50,
            "hours_total": 750,
            "renews_on": get_renewal_date()
        }
    except Exception as e:
        print(f"Hosting error: {e}")
        hosting = cached.get("hosting", {})

    try:
        apis_data = [item() for item in API_TOTAL]
    except Exception as e:
        print(f"APIs error: {e}")
        apis_data = cached.get("apis", [])

    try:
        projects = check_render()
    except Exception as e:
        print(f"Projects error: {e}")
        projects = cached.get("projects", [])

    try:
        monitor = check_cron_jobs()
    except Exception as e:
        print(f"Cron jobs error: {e}")
        monitor = cached.get("monitor", [])

    data = {
        "last_synced_at": current_timestamp_ist(),
        "hosting": hosting,
        "apis": apis_data,
        "projects": projects,
        "monitor": monitor
    }
    save_cache(data)
    return jsonify(data), 200


@app.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    data = load_cache()
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)
