import "../../app/globals.css";
import Image from "next/image";
import "../../app/globals.css";

export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-zinc-800 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-[250px] h-[250px]">
          <Image
            src="/images/finalchuyans.png"
            alt="PSA-Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="mt-20 text-4xl font-semibold text-white font-inter varela-round-regular">
          PSA Academy
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
