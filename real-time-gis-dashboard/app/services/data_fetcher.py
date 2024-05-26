import requests
from flask_socketio import emit
import time


def fetch_data(socketio):
    while True:
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast?latitude=51.505&longitude=-0.09&hourly=temperature_2m"
        )
        data = response.json()
        socketio.emit("update", data)
        time.sleep(10)
