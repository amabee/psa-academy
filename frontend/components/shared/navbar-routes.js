"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import SearchInput from "./search-input";
import { ModeToggle } from "./mode-toggle";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        <div className="pr-6">
          <ModeToggle />
        </div>

        <Link href="/">
          <Button size={"sm"} variant={"ghost"}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>

        {/* <UserButton afterSignOutUrl="/" /> */}
      </div>
    </>
  );
};

export default NavbarRoutes;
