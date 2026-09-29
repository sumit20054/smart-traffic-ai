const Road = ({ direction, count }) => {
  return (
    <div className="text-center">
      <h2 className="text-white font-bold">{direction.toUpperCase()}</h2>
      <p className="text-green-400">{count} vehicles</p>
    </div>
  );
};

export default Road;