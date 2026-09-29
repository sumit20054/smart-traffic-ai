from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LinearRegression
import random

app = Flask(__name__)
CORS(app)   # ✅ VERY IMPORTANT (this fixes CORS)

# 🔥 Traffic history
data = {
    "north": [random.randint(40, 80) for _ in range(5)],
    "south": [random.randint(20, 50) for _ in range(5)],
    "east": [random.randint(30, 70) for _ in range(5)],
    "west": [random.randint(10, 40) for _ in range(5)]
}

# 🧠 Predict traffic using ML
def predict_lane_traffic(values):
    y = np.array(values)
    X = np.arange(len(y)).reshape(-1, 1)

    model = LinearRegression()
    model.fit(X, y)

    next_val = model.predict([[len(y)]])[0]
    return max(0, int(next_val))

# ⏱ Dynamic green time
def calculate_green_time(traffic):
    if traffic > 70:
        return 25
    elif traffic > 50:
        return 20
    elif traffic > 30:
        return 15
    else:
        return 10

# 📈 Trend detection
def get_trend(values):
    return "increasing" if values[-1] > values[0] else "decreasing"

# 🤖 MAIN AI LOGIC
def predict_traffic():
    prediction = {}
    trends = {}

    for direction in data:
        next_val = predict_lane_traffic(data[direction])
        prediction[direction] = next_val
        trends[direction] = get_trend(data[direction])

        data[direction].append(next_val)
        if len(data[direction]) > 10:
            data[direction].pop(0)

    decision = {}

    # 🚑 Ambulance priority
    if random.random() < 0.2:
        lane = random.choice(list(prediction.keys()))
        decision.update({
            "selected": lane,
            "reason": "🚑 Emergency vehicle detected",
            "ambulance": lane,
            "green_time": 30,
            "confidence": 1.0
        })
        return {**prediction, **decision, "trends": trends}

    # 🚫 Empty lane
    empty_lanes = [k for k, v in prediction.items() if v == 0]
    if empty_lanes:
        lane = empty_lanes[0]
        decision.update({
            "selected": lane,
            "reason": "🚫 Empty lane priority",
            "green_time": 10,
            "confidence": 0.9
        })
        return {**prediction, **decision, "trends": trends}

    # ⚡ Low traffic
    low_lanes = [k for k, v in prediction.items() if v < 10]
    if low_lanes:
        lane = low_lanes[0]
        decision.update({
            "selected": lane,
            "reason": "⚡ Low traffic clearance",
            "green_time": 12,
            "confidence": 0.85
        })
        return {**prediction, **decision, "trends": trends}

    # 🤖 ML-based selection
    best_lane = max(prediction, key=prediction.get)
    max_traffic = prediction[best_lane]

    decision.update({
        "selected": best_lane,
        "reason": f"🤖 Highest predicted traffic in {best_lane}",
        "green_time": calculate_green_time(max_traffic),
        "confidence": round(max_traffic / 100, 2)
    })

    return {**prediction, **decision, "trends": trends}

# 🌐 API
@app.route("/ml-predict", methods=["GET"])
def ml_predict():
    result = predict_traffic()
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=8000, debug=True)