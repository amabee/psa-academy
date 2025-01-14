"use client";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-10 py-3 bg-white sticky top-0 z-10 border-b-[0.5px] border-gray-300">
      <Link href={"/"}>
        <div className="flex gap-2 items-center">
          <GraduationCap size={30} />
          <h2 className="font-bold text-2xl">PSA-Academy</h2>
        </div>
      </Link>
      <div className="flex gap-2 items-center">
        <Link href={"/auth/signin"} prefetch={true}>
          <Button>Sign In</Button>
        </Link>
        <Link href={"/auth/signup"} prefetch={true}>
          <Button variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}