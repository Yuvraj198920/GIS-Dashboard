# app.py
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import requests
import time

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q")
    response = requests.get(
        f"https://nominatim.openstreetmap.org/search?format=json&q={query}"
    )
    return jsonify(response.json())


def fetch_data():
    while True:
        # Example API call (replace with actual API)
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast?latitude=51.505&longitude=-0.09&hourly=temperature_2m"
        )
        data = response.json()
        socketio.emit("update", data)
        time.sleep(10)  # Fetch new data every 10 seconds


@socketio.on("connect")
def handle_connect():
    print("Client connected")
    socketio.start_background_task(fetch_data)


if __name__ == "__main__":
    socketio.run(app)
