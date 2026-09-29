const TrafficLight = ({ active }) => {
  return (
    <div className="flex flex-col items-center bg-black p-2 rounded-xl w-12">
      <div className={`w-6 h-6 rounded-full mb-1 ${active === "red" ? "bg-red-500" : "bg-gray-600"}`} />
      <div className={`w-6 h-6 rounded-full mb-1 ${active === "yellow" ? "bg-yellow-400" : "bg-gray-600"}`} />
      <div className={`w-6 h-6 rounded-full ${active === "green" ? "bg-green-500" : "bg-gray-600"}`} />
    </div>
  );
};

export default TrafficLight;