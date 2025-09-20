const StatCard = ({ icon, number, type, color = 'text-ediblue', subtitle }) => {
  const displayNumber = Number.isFinite(number) ? number.toLocaleString() : '0';

  return (
    <div
      role="region"
      aria-label={`Estadística de ${type}`}
      tabIndex={0}
      className="bg-white/50 backdrop-blur-md rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:scale-105
                 transform transition-all duration-500 outline-none focus:outline focus:outline-ediblue
                 p-6 min-h-[16rem] w-full flex flex-col items-center justify-center gap-5"
    >
      <div
        className={`text-5xl ${color} w-20 h-20 flex items-center justify-center rounded-full 
                    bg-gradient-to-tr from-gray-100/60 via-white/50 to-gray-200/60 shadow-lg`}
      >
        {icon}
      </div>

      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 drop-shadow-sm animate-fadeIn">
        {displayNumber}
      </h2>

      <h3 className="text-lg sm:text-xl text-gray-600 uppercase tracking-wide text-center font-semibold">
        {type}
      </h3>

      {subtitle && (
        <p className="text-sm sm:text-base text-gray-400 mt-1 text-center italic">
          {subtitle}
        </p>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-700 ease-in-out`}
          style={{ width: `${Math.min(displayNumber / 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
