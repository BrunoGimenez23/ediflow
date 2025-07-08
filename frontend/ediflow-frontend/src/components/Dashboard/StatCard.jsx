const StatCard = ({ icon, number, type, color = 'text-ediblue' }) => {
  const displayNumber = Number.isFinite(number) ? number.toLocaleString() : '0';

  return (
    <div
      role="region"
      aria-label={`Estadística de ${type}`}
      tabIndex={0}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md 
                 transition-shadow duration-300 outline-none focus:outline focus:outline-ediblue
                 p-6 min-h-[14rem] w-full flex flex-col items-center justify-center gap-4"
    >
      <div
        className={`text-5xl ${color} w-16 h-16 flex items-center justify-center rounded-full bg-gray-100`}
      >
        {icon}
      </div>
      <h2 className="text-4xl font-extrabold text-gray-800">
        {displayNumber}
      </h2>
      <h3 className="text-lg text-gray-500 uppercase tracking-wider text-center">
        Total {type}
      </h3>
    </div>
  );
};

export default StatCard;
