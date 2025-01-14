"use client";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Navbar = ({ isCoursePage }) => {
  let userRole = "student";

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                className={cn("dashboard-navbar__search-input", {
                  "!bg-customgreys-secondarybg": isCoursePage,
                })}
                scroll={false}
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="dashboard-navbar__search-icon" size={18} />
            </div>
          </div>
        </div>

        <div className="dashboard-navbar__actions">
          <button className="dashboard-navbar__notification-button">
            <span className="dashboard-navbar__notification-indicator"></span>
            <Bell className="dashboard-navbar__notification-icon" />
          </button>

             {/* <div
            className="user-button"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span className="user-role">
              {userRole === "teacher" ? "Teacher" : "Student"}
            </span>
           
            <Link
              href={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
              className="user-profile-link"
            >
              Profile
            </Link>
          </div> */}

          <Button 
            variant="ghost" 
            className="hover:scale-105 transition-transform duration-200  w-full h-12"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Profile
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;