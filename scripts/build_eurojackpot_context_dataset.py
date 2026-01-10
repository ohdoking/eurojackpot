# pip install requests beautifulsoup4 pandas python-dateutil
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import pandas as pd
import time
import dateparser
from requests.exceptions import ConnectionError
import re 
import random

def fetch_with_retry(url, headers, retries=3, delay=3):
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10, headers=headers)
            response.raise_for_status()
            return response
        except ConnectionError as e:
            print(f"[WARN] Connection error: {e}, retrying {attempt + 1}/{retries}")
            time.sleep(delay)
        except Exception as e:
            print(f"[ERROR] {e}")
            break
    return None

def fetch_eurojackpot_history(year: int):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
    }
    
    url = f"https://www.euro-jackpot.net/en/results-archive-{year}"
    res = fetch_with_retry(url, headers)

    soup = BeautifulSoup(res.text, "html.parser")
    rows = soup.select("table tbody tr")

    data = []

    for row in rows:
        # 1. 날짜 추출 (첫 번째 <td> 안 <a> 태그 텍스트)
        date_tag = row.find("a")
        if not date_tag:
            continue

        # raw_date_text = date_tag.get_text(strip=True)
        # # 예: "Friday 30th December 2016" 에서 "30th" 처리 필요 → dateparser 추천, 또는 정규표현식 제거
        
        # # 숫자와 문자 정리 (th, nd 등 제거)
        # clean_date_text = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', raw_date_text)
        
        # try:
        #     draw_date = datetime.strptime(clean_date_text, "%A %d %B %Y")
        # except ValueError:
        #     # 날짜 포맷 다를 경우 예외 처리
        #     continue

        # href 값 가져오기
        href = date_tag.get("href")  # "/results/28-12-2018"

        # href에서 날짜 부분만 추출 (정규표현식 사용)
        match = re.search(r"/results/(\d{2}-\d{2}-\d{4})", href)
        if match:
            date_str = match.group(1)  # "28-12-2018"
            # datetime 객체로 변환
            draw_date = datetime.strptime(date_str, "%d-%m-%Y")
            print(draw_date)  # 2018-12-28 00:00:00
        else:
            print("No date found in href")
        
        # 2. 번호 추출 (두 번째 <td> 안 <ul> 태그 안 <li> 태그들)
        balls_ul = row.find_all("td")[1].find("ul", class_="balls")
        if not balls_ul:
            continue
        
        ball_numbers = []
        euro_numbers = []
        
        for li in balls_ul.find_all("li"):
            num_text = li.find("span").text.strip()
            num = int(num_text)
            if "ball" in li.get("class", []):
                ball_numbers.append(num)
            elif "euro" in li.get("class", []):
                euro_numbers.append(num)
        
        # 3. 결과 저장
        data.append({
            "date": draw_date.strftime("%Y-%m-%d"),
            "numbers": ball_numbers,
            "euro_numbers": euro_numbers,
            # jackpot 정보가 HTML에 없다면 따로 크롤링 필요
        })

    return data

def fetch_weather(date: str):
    url = (
        "https://archive-api.open-meteo.com/v1/archive"
        "?latitude=60.1699&longitude=24.9384"
        f"&start_date={date}&end_date={date}"
        "&daily=temperature_2m_mean,precipitation_sum,windspeed_10m_max"
        "&timezone=Europe/Helsinki"
    )

    res = requests.get(url, timeout=10)
    res.raise_for_status()
    daily = res.json()["daily"]

    return {
        "temp_avg": daily["temperature_2m_mean"][0],
        "precipitation": daily["precipitation_sum"][0],
        "wind_max": daily["windspeed_10m_max"][0]
    }

def fetch_daylight_minutes(date: str):
    url = (
        "https://api.sunrise-sunset.org/json"
        f"?lat=60.1699&lng=24.9384&date={date}&formatted=0"
    )
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    result = res.json()["results"]

    sunrise = datetime.fromisoformat(result["sunrise"])
    sunset = datetime.fromisoformat(result["sunset"])

    return int((sunset - sunrise).total_seconds() / 60)

def date_context(date: str):
    d = datetime.strptime(date, "%Y-%m-%d")

    if d.month in [12, 1, 2]:
        season = "winter"
    elif d.month in [3, 4, 5]:
        season = "spring"
    elif d.month in [6, 7, 8]:
        season = "summer"
    else:
        season = "autumn"

    return {
        "weekday": d.strftime("%A"),
        "week_of_year": d.isocalendar().week,
        "month": d.month,
        "season": season
    }

import json
from time import sleep

def build_dataset(start_year=2012, end_year=2025):
    dataset = []

    for year in range(start_year, end_year + 1):
        draws = fetch_eurojackpot_history(year)

        for draw in draws:
            date = draw["date"]

            try:
                weather = fetch_weather(date)
                daylight = fetch_daylight_minutes(date)
                context = date_context(date)

                draw["weather"] = weather
                draw["daylight_minutes"] = daylight
                draw["context"] = context

                dataset.append(draw)
                sleep(0.5)  # API 매너
            except Exception as e:
                print(f"Error on {date}: {e}")

        time.sleep(random.uniform(1, 3))
    return dataset

if __name__ == "__main__":
    data = build_dataset(2018, 2025)

    with open("eurojackpot_context_dataset.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(data)} records")
