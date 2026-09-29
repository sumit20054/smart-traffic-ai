const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ⚠️ make sure version = 2

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Store traffic history
let history = {
  north: [],
  south: [],
  east: [],
  west: [],
};

// 🔥 Generate realistic traffic
function generateTraffic() {
  const data = {
    north: Math.floor(40 + Math.random() * 60),
    south: Math.floor(20 + Math.random() * 50),
    east: Math.floor(30 + Math.random() * 70),
    west: Math.floor(10 + Math.random() * 40),
  };

  Object.keys(data).forEach((dir) => {
    history[dir].push(data[dir]);
    if (history[dir].length > 10) history[dir].shift();
  });

  return data;
}

// 📊 Traffic API
app.get("/traffic", (req, res) => {
  res.json(generateTraffic());
});

// 🤖 ML Prediction API
app.get("/ml-predict", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/ml-predict");

    if (!response.ok) {
      throw new Error(`ML server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Empty ML response");
    }

    res.json(data);

  } catch (err) {
    console.error("❌ ML ERROR:", err.message);

    res.status(500).json({
      error: "ML server not responding",
      details: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});