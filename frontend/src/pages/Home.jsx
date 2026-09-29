import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("north");

  // 🔥 Mini signal animation
  useEffect(() => {
    const dirs = ["north", "east", "south", "west"];
    let i = 0;

    const interval = setInterval(() => {
      setActive(dirs[i % 4]);
      i++;
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 Animated stats
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const targets = [40, 30, 25];

    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((val, i) =>
          val < targets[i] ? val + 1 : val
        )
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const reveal = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 gap-4 md:gap-0 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <h1 className="text-2xl font-bold text-green-400">
          SmartTraffic 
        </h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/simulation")}
          className="bg-green-500 px-6 py-2 rounded-full shadow-lg z-10"
        >
          Launch Demo
        </motion.button>
      </nav>

      {/* HERO */}
      <div className="text-center mt-16 md:mt-20 px-4 md:px-6 relative">

        {/* 🔥 FIXED OVERLAY */}
        <div className="absolute inset-0 bg-green-500/10 blur-3xl pointer-events-none"></div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative text-3xl md:text-6xl font-extrabold leading-tight z-10"
        >
          🚦 AI Smart  
          <span className="text-green-400"> Traffic System</span>
        </motion.h1>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto relative z-10">
          Optimize traffic flow, reduce congestion, and save fuel using intelligent AI-powered signal control.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/simulation")}
          className="relative z-10 mt-8 bg-green-500 px-8 py-3 rounded-full text-lg shadow-xl"
        >
           Start Simulation
        </motion.button>
      </div>

      {/* MINI SIMULATION */}
      <div className="mt-16 md:mt-20 flex justify-center">
        <div className="grid grid-cols-3 gap-3 items-center">

          <div></div>
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-bold transition
            ${active === "north" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-800"}`}>
            N
          </div>
          <div></div>

          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-bold transition
            ${active === "west" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-800"}`}>
            W
          </div>

          <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-900 rounded-xl"></div>

          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-bold transition
            ${active === "east" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-800"}`}>
            E
          </div>

          <div></div>
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-bold transition
            ${active === "south" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-800"}`}>
            S
          </div>
          <div></div>
        </div>
      </div>

      {/* PROBLEM */}
      <motion.div {...reveal} className="mt-20 px-4 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-red-400">
          🚨 The Problem
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Fixed traffic systems create unnecessary delays, fuel wastage, and fail to prioritize emergency vehicles.
        </p>
      </motion.div>

      {/* STATS */}
      <motion.div {...reveal} className="mt-16 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

        {counts.map((val, i) => {
          const labels = [
            "Less Waiting Time",
            "Fuel Saved",
            "Pollution Reduced",
          ];

          return (
            <div key={i} className="bg-white/5 backdrop-blur-lg p-6 rounded-xl shadow hover:scale-105 transition">
              <h2 className="text-3xl text-green-400 font-bold">
                {val}%
              </h2>
              <p className="text-gray-400 mt-2">{labels[i]}</p>
            </div>
          );
        })}

      </motion.div>

      {/* FEATURES */}
      <motion.div {...reveal} className="mt-20 px-4 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-green-400">
           Key Features
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-lg shadow hover:-translate-y-2 transition">
            🤖 AI Optimization
          </div>

          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-lg shadow hover:-translate-y-2 transition">
            🚑 Emergency Priority
          </div>

          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-lg shadow hover:-translate-y-2 transition">
            🌍 Live Navigation
          </div>

        </div>
      </motion.div>

      {/* CTA */}
      <motion.div {...reveal} className="mt-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Ready to experience smart traffic?
        </h2>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/simulation")}
          className="mt-6 bg-green-500 px-10 py-3 rounded-full text-lg shadow-xl"
        >
           Launch Now
        </motion.button>
      </motion.div>

      {/* FOOTER */}
      <div className="mt-20 text-center text-gray-500 pb-6">
        Built by Gautam Yadav 
      </div>

    </div>
  );
};

export default Home;