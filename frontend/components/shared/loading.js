import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className="relative flex justify-center items-center loading">
      <div className="absolute animate-spin rounded-full h-64 w-64 border-t-4 border-b-4 border-blue-500"></div>
      <Image
        src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
        className="rounded-full"
        width={140}
        height={140}
        alt="Loading..."
      />
    </div>
  );
};

export default Loading;
