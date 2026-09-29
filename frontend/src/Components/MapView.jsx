import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const defaultCenter = [26.8467, 80.9462];

// 🚦 Roads
const lanePaths = {
  north: [[26.8507, 80.9462],[26.8467, 80.9462]],
  south: [[26.8427, 80.9462],[26.8467, 80.9462]],
  east: [[26.8467, 80.9502],[26.8467, 80.9462]],
  west: [[26.8467, 80.9422],[26.8467, 80.9462]],
};

// 🔊 Voice
const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
};

// 🎨 Traffic Heatmap
const getColor = (val) => {
  if (val > 50) return "#ff0000";
  if (val > 25) return "#facc15";
  return "#22c55e";
};

// 🧭 Routing
const Routing = ({ start, end, setRouteInfo }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1]),
      ],
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    }).addTo(map);

    control.on("routesfound", (e) => {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      const time = (route.summary.totalTime / 60).toFixed(1);

      setRouteInfo({ distance, time });
      speak(`Route ready. Distance ${distance} km. Time ${time} minutes`);
    });

    return () => map.removeControl(control);
  }, [start, end]);

  return null;
};

// 📍 Follow user
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position]);
  return null;
};

const MapView = ({ traffic = {}, green }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  // 🚀 Live tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 🚗 Vehicle simulation (with types)
  useEffect(() => {
    const types = ["🚗", "🚌", "🚑"];

    const interval = setInterval(() => {
      const newVehicles = [];

      Object.keys(lanePaths).forEach((lane) => {
        const path = lanePaths[lane];
        const count = Math.min(traffic[lane] || 0, 3);

        for (let i = 0; i < count; i++) {
          const t = Math.random();

          const lat =
            path[0][0] + (path[1][0] - path[0][0]) * t;
          const lng =
            path[0][1] + (path[1][1] - path[0][1]) * t;

          newVehicles.push({
            pos: [lat, lng],
            type: types[Math.floor(Math.random() * types.length)],
          });
        }
      });

      setVehicles(newVehicles);
    }, 2000);

    return () => clearInterval(interval);
  }, [traffic]);

  // 🎯 Click destination
  const handleClick = (e) => {
    setDestination([e.latlng.lat, e.latlng.lng]);
    speak("Destination selected");
  };

  return (
    <div className="w-full">

      {/* 🧭 Info Panel */}
      {routeInfo && (
        <div className="bg-black/80 p-3 rounded mb-2 text-white text-center">
          📏 {routeInfo.distance} km | ⏱ {routeInfo.time} min
        </div>
      )}

      <MapContainer
        center={userLocation || defaultCenter}
        zoom={14}
        style={{ height: "450px", borderRadius: "12px" }}
        whenCreated={(map) => map.on("click", handleClick)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap position={userLocation} />

        {/* 📍 User */}
        {userLocation && <Marker position={userLocation} />}

        {/* 🎯 Destination */}
        {destination && <Marker position={destination} />}

        {/* 🧭 Route */}
        {userLocation && destination && (
          <Routing
            start={userLocation}
            end={destination}
            setRouteInfo={setRouteInfo}
          />
        )}

        {/* 🚦 Traffic Heatmap Roads */}
        {Object.keys(lanePaths).map((lane) => (
          <Polyline
            key={lane}
            positions={lanePaths[lane]}
            pathOptions={{
              color:
                lane === green
                  ? "#00ffcc"
                  : getColor(traffic[lane] || 0),
              weight: lane === green ? 10 : 6,
              opacity: 0.8,
            }}
          />
        ))}

        {/* 🚗 Vehicles */}
        {vehicles.map((v, i) => (
          <Marker key={i} position={v.pos}>
            <Popup>{v.type}</Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default MapView;