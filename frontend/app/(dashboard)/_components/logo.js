import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      <Image height={80} width={80} alt="logo" src="/images/finalchuyans.png" />
      <span className="mt-2 text-xl font-bold">PSA Academy</span>
    </div>
  );
};

export default Logo;
