let history = {
  north: [],
  south: [],
  east: [],
  west: [],
};

// Generate realistic traffic (pattern-based)
export function generateTraffic() {
  const data = {
    north: Math.floor(40 + Math.random() * 60),
    south: Math.floor(20 + Math.random() * 50),
    east: Math.floor(30 + Math.random() * 70),
    west: Math.floor(10 + Math.random() * 40),
  };

  // store history
  Object.keys(data).forEach((dir) => {
    history[dir].push(data[dir]);
    if (history[dir].length > 5) history[dir].shift();
  });

  return data;
}

// 🔥 AI Prediction (trend-based)
export function predictTraffic() {
  let prediction = {};

  Object.keys(history).forEach((dir) => {
    let arr = history[dir];
    if (arr.length === 0) return;

    let avg = arr.reduce((a, b) => a + b, 0) / arr.length;

    // simple trend: last value weight
    prediction[dir] = Math.floor(avg * 0.7 + arr[arr.length - 1] * 0.3);
  });

  return prediction;
}

// 🔥 Smart AI Decision
export function getGreenSignalAI(prediction) {
  let max = Math.max(...Object.values(prediction));
  return Object.keys(prediction).find(
    (dir) => prediction[dir] === max
  );
}