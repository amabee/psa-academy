export const AnimeLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="relative">
        <div className="absolute inset-0 w-24 h-24 rounded-full animate-[spin_3s_linear_infinite] before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-500 before:animate-[spin_3s_linear_infinite] after:content-[''] after:absolute after:inset-1 after:rounded-full after:bg-gray-900"></div>

        <div className="relative w-24 h-24">
          <div className="absolute w-full h-full border-t-4 border-purple-500 rounded-full animate-[spin_1s_linear_infinite]"></div>
          <div className="absolute w-full h-full border-r-4 border-cyan-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute w-full h-full border-b-4 border-pink-500 rounded-full animate-[spin_3s_linear_infinite]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="mt-4 text-xl font-medium text-white-100">
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite]">
          Loading Data
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-100">
          .
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-200">
          .
        </span>
        <span className="inline-block animate-[pulse_2s_ease-in-out_infinite] delay-300">
          .
        </span>
      </div>
    </div>
  );
};
