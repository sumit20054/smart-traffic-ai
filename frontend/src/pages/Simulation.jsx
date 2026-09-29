import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";

const lanes = ["north", "south", "east", "west"];

const Simulation = () => {
  const [traffic, setTraffic] = useState({
    north: 20,
    south: 15,
    east: 25,
    west: 10,
  });

  const [green, setGreen] = useState("north");
  const [signalState, setSignalState] = useState("green");
  const [mode, setMode] = useState("AI");
  const [timer, setTimer] = useState(10);
  const [reason, setReason] = useState("");
  const [emergency, setEmergency] = useState(false);

  const [metrics, setMetrics] = useState({
    waitTime: 0,
    fuelSaved: 0,
    vehiclesCleared: 0,
    normalWait: 40,
    aiWait: 20,
  });

  const [history, setHistory] = useState([]);

  const [cars] = useState({
    north: Array(6).fill(0),
    south: Array(5).fill(0),
    east: Array(7).fill(0),
    west: Array(4).fill(0),
  });

  // 🔥 ML API (SAFE)
const fetchMLData = async () => {
  try {
    const res = await fetch("https://smart-traffic-ai-nqno.onrender.com/ml-predict");
    const data = await res.json();

    setTraffic({
      north: data.north,
      south: data.south,
      east: data.east,
      west: data.west,
    });

    setReason(data.reason);
  } catch (err) {
    console.log("ML API not running → using simulation");
  }
};

  const generateTraffic = (prev) => {
    const updated = {};
    lanes.forEach((lane) => {
      let current = prev[lane];
      const incoming = Math.floor(Math.random() * 8);
      const outgoing = green === lane ? Math.floor(Math.random() * 12) : 0;
      updated[lane] = Math.max(0, current + incoming - outgoing);
    });
    return updated;
  };

  const chooseLane = (data) => {
    return Object.keys(data).reduce((a, b) =>
      data[a] > data[b] ? a : b
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {

      fetchMLData(); // 🔥 ML CALL

      setTraffic((prev) => {
        const newTraffic = generateTraffic(prev);

        const selected =
          mode === "AI"
            ? chooseLane(newTraffic)
            : lanes[Math.floor(Math.random() * 4)];

        // 🚑 Emergency override
        if (emergency) {
          setGreen("north");
          setReason("🚑 Emergency priority activated");
        } else {
          setGreen(selected);
        }

        const aiWait = Math.floor(Math.random() * 15);
        const normalWait = aiWait + Math.floor(Math.random() * 25);

        setMetrics({
          waitTime: aiWait,
          fuelSaved: Math.floor(Math.random() * 20),
          vehiclesCleared: Math.floor(Math.random() * 120),
          normalWait,
          aiWait,
        });

        setHistory((prevHist) => [
          ...prevHist.slice(-9),
          {
            time: Date.now(),
            ...newTraffic,
          },
        ]);

        return newTraffic;
      });

      setSignalState("yellow");
      setTimeout(() => setSignalState("green"), 800);
      

    }, 3000);

    return () => clearInterval(interval);
  }, [mode, green, emergency]);

  const barData = [
    { name: "North", value: traffic.north },
    { name: "South", value: traffic.south },
    { name: "East", value: traffic.east },
    { name: "West", value: traffic.west },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex flex-col items-center px-4">

      {/* HEADER */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <h1 className="text-2xl font-bold text-green-400">
          🚦 Smart Traffic AI System
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setMode(mode === "AI" ? "MANUAL" : "AI")}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-full shadow-lg transition"
          >
            Mode: {mode}
          </button>

          <button
            onClick={() => setEmergency(!emergency)}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full shadow-lg transition"
          >
            🚑 {emergency ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* TIMER */}
      <div className="mt-4 text-lg bg-white/5 px-4 py-2 rounded-full backdrop-blur-md shadow">
        ⏱ Signal Time: <span className="text-green-400">{timer}s</span>
      </div>

      {/* INTERSECTION */}
      <div className="relative mt-10 w-[400px] h-[400px] bg-white/5 backdrop-blur-lg rounded-2xl p-4 shadow-lg">
        <div className="absolute top-0 left-1/2 w-24 h-full bg-gray-800 -translate-x-1/2"></div>
        <div className="absolute left-0 top-1/2 h-24 w-full bg-gray-800 -translate-y-1/2"></div>

        {lanes.map((dir) => (
          <div
            key={dir}
            className="absolute"
            style={{
              top: dir === "north" ? 10 : dir === "south" ? 350 : "50%",
              left: dir === "west" ? 10 : dir === "east" ? 350 : "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="bg-black p-2 rounded-xl">
              <div
                className={`w-5 h-5 rounded-full ${
                  signalState === "yellow"
                    ? "bg-yellow-400 animate-pulse"
                    : green === dir
                    ? "bg-green-400 shadow-[0_0_10px_#22c55e]"
                    : "bg-red-500"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

{/* TRAFFIC CARDS */}
<div className="mt-6 grid grid-cols-2 gap-4">
  {Object.entries(traffic).map(([dir, val]) => {
    const laneInfo = {
      north: { name: "North", arrow: "⬆️" },
      south: { name: "South", arrow: "⬇️" },
      east: { name: "East", arrow: "➡️" },
      west: { name: "West", arrow: "⬅️" },
    };

    return (
      <div
        key={dir}
        className="bg-white/5 backdrop-blur-lg p-4 rounded-xl shadow hover:scale-105 transition text-center"
      >
        <p className="text-lg font-semibold text-blue-400">
          {laneInfo[dir].arrow} {laneInfo[dir].name} Lane
        </p>
        <p className="text-green-400 text-xl">{val} vehicles</p>
      </div>
    );
  })}
</div>

      {/* AI */}
      <div className="mt-6 bg-white/5 backdrop-blur-lg p-5 rounded-xl text-center w-[320px] shadow-lg border border-white/10">
        <h2 className="text-yellow-400 font-bold">🤖 AI Decision</h2>
        <p className="text-green-400">{green.toUpperCase()}</p>
        <p className="text-blue-400 text-sm whitespace-pre-line">{reason}</p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 backdrop-blur-lg p-3 rounded-xl text-center shadow">
          ⏱ {metrics.waitTime}s
        </div>
        <div className="bg-white/5 backdrop-blur-lg p-3 rounded-xl text-center shadow">
          ⛽ {metrics.fuelSaved}%
        </div>
        <div className="bg-white/5 backdrop-blur-lg p-3 rounded-xl text-center shadow">
          🚗 {metrics.vehiclesCleared}
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-8 bg-white/5 backdrop-blur-lg p-4 rounded-xl shadow-lg">
        <BarChart width={350} height={220} data={barData}>
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Bar dataKey="value" fill="#22c55e" />
        </BarChart>
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-lg p-4 rounded-xl shadow-lg">
        <LineChart width={350} height={220} data={history}>
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="north" stroke="#22c55e" />
          <Line type="monotone" dataKey="south" stroke="#facc15" />
          <Line type="monotone" dataKey="east" stroke="#3b82f6" />
          <Line type="monotone" dataKey="west" stroke="#ef4444" />
        </LineChart>
      </div>

      {/* MAP */}
      <div className="mt-10 w-full max-w-3xl bg-white/5 backdrop-blur-lg p-4 rounded-2xl shadow-lg">
        <h2 className="text-green-400 mb-2 text-center">🌍 Live Traffic Map</h2>
        <MapView traffic={traffic} green={green} />
      </div>

      {/* ANALYTICS */}
      <div className="mt-6 bg-white/5 backdrop-blur-lg p-4 rounded-xl shadow-lg">
        <h3 className="text-purple-400 mb-2">📊 Analytics</h3>
        <p>Total Vehicles: {Object.values(traffic).reduce((a,b)=>a+b,0)}</p>
        <p>Avg Wait Time: {metrics.waitTime}s</p>
        <p>AI Efficiency: {Math.max(0, 100 - metrics.waitTime * 2)}%</p>
      </div>

    </div>
  );
  
};

export default Simulation;