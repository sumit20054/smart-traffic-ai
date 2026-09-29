const ControlPanel = ({ setEmergency }) => {
  return (
    <div className="mt-4">
      <button
        onClick={() => setEmergency(true)}
        className="bg-red-600 px-4 py-2 rounded-lg text-white mr-2"
      >
        🚑 Emergency Mode
      </button>

      <button
        onClick={() => setEmergency(false)}
        className="bg-green-600 px-4 py-2 rounded-lg text-white"
      >
        Normal Mode
      </button>
    </div>
  );
};

export default ControlPanel;