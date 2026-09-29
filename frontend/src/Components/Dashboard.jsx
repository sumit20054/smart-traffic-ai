import MapView from "./MapView"; // adjust path if needed

const Dashboard = ({ traffic, green }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl text-white mt-4 shadow-lg border border-white/10">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-4 text-green-400">
        📊 Traffic Dashboard
      </h2>

      {/* TRAFFIC GRID */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(traffic).map(([dir, val]) => (
          <div
            key={dir}
            className="bg-black/40 p-4 rounded-xl flex justify-between items-center shadow hover:scale-105 transition"
          >
            <span className="text-gray-300 font-medium">
              {dir.toUpperCase()}
            </span>
            <span className="text-green-400 text-lg font-bold">
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* SIGNAL STATUS */}
      <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
        <p className="text-gray-300 text-sm">Active Signal</p>
        <h3 className="text-2xl font-bold text-green-400">
          {green.toUpperCase()}
        </h3>
      </div>

      {/* MAP SECTION */}
      <div className="mt-6 bg-black/40 p-4 rounded-xl shadow">
        <h3 className="text-lg mb-3 text-blue-400 font-semibold">
          🗺️ Live Traffic Map
        </h3>

        <div className="rounded-xl overflow-hidden">
          <MapView traffic={traffic} green={green} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;