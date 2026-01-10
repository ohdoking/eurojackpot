import json
import time
from datetime import datetime, date
from typing import List, Dict

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from astral import LocationInfo
from astral.sun import sun


# =========================
# CONFIG
# =========================
START_YEAR = 2012
END_YEAR = datetime.now().year
OUTPUT_FILE = "eurojackpot_context_dataset.json"

BASE_URL = "https://www.eurojackpot.org/api/draws"

# EuroJackpot draw location (Helsinki)
LOCATION = {
    "name": "Helsinki",
    "lat": 60.1699,
    "lon": 24.9384,
    "timezone": "Europe/Helsinki",
}


# =========================
# SESSION WITH RETRY
# =========================
def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        ),
        "Accept": "application/json",
    })

    retry = Retry(
        total=5,
        backoff_factor=1.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
        raise_on_status=False,
    )

    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    return session


session = create_session()


# =========================
# FETCH EUROJACKPOT
# =========================
def fetch_eurojackpot_history(year: int) -> List[Dict]:
    url = f"{BASE_URL}/{year}"

    try:
        res = session.get(url, timeout=20)
        if res.status_code != 200:
            print(f"[WARN] {year} status {res.status_code}")
            return []
        return res.json().get("draws", [])
    except Exception as e:
        print(f"[ERROR] EuroJackpot {year}: {e}")
        return []


# =========================
# FETCH WEATHER (Open-Meteo)
# =========================
def fetch_weather(draw_date: str) -> Dict:
    url = (
        "https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={LOCATION['lat']}"
        f"&longitude={LOCATION['lon']}"
        f"&start_date={draw_date}"
        f"&end_date={draw_date}"
        "&daily=temperature_2m_mean,precipitation_sum,cloudcover_mean"
        f"&timezone={LOCATION['timezone']}"
    )

    try:
        res = session.get(url, timeout=20)
        data = res.json().get("daily", {})

        return {
            "avg_temp_c": data.get("temperature_2m_mean", [None])[0],
            "precipitation_mm": data.get("precipitation_sum", [None])[0],
            "cloudcover_pct": data.get("cloudcover_mean", [None])[0],
        }
    except Exception:
        return {
            "avg_temp_c": None,
            "precipitation_mm": None,
            "cloudcover_pct": None,
        }


# =========================
# FETCH DAYLIGHT (Astral)
# =========================
def fetch_daylight_minutes(draw_date: str) -> int | None:
    try:
        city = LocationInfo(
            LOCATION["name"],
            timezone=LOCATION["timezone"],
            latitude=LOCATION["lat"],
            longitude=LOCATION["lon"],
        )

        d = datetime.fromisoformat(draw_date).date()
        s = sun(city.observer, date=d)

        return int((s["sunset"] - s["sunrise"]).seconds / 60)
    except Exception:
        return None


# =========================
# NORMALIZE DRAW
# =========================
def normalize_draw(draw: Dict) -> Dict:
    draw_date = draw.get("date")

    weather = fetch_weather(draw_date)
    daylight_minutes = fetch_daylight_minutes(draw_date)

    return {
        "draw_date": draw_date,
        "numbers": draw.get("numbers", []),
        "euro_numbers": draw.get("euroNumbers", []),
        "jackpot": draw.get("jackpot"),
        "context": {
            "location": LOCATION["name"],
            "weather": weather,
            "daylight_minutes": daylight_minutes,
        },
    }


# =========================
# BUILD DATASET
# =========================
def build_dataset():
    all_draws: List[Dict] = []

    print("🚀 Building EuroJackpot Context Dataset")
    print(f"📍 Location: {LOCATION['name']}")
    print("")

    for year in range(START_YEAR, END_YEAR + 1):
        print(f"🔄 Fetching year {year}")
        draws = fetch_eurojackpot_history(year)

        for draw in draws:
            all_draws.append(normalize_draw(draw))
            time.sleep(0.4)  # avoid weather API rate-limit

        time.sleep(1.5)

    dataset = {
        "meta": {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "source": "eurojackpot.org + open-meteo.com",
            "location": LOCATION,
            "total_draws": len(all_draws),
        },
        "draws": all_draws,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    print(f"✅ Dataset saved → {OUTPUT_FILE}")
    print(f"📊 Total draws: {len(all_draws)}")


# =========================
# ENTRYPOINT
# =========================
if __name__ == "__main__":
    build_dataset()
