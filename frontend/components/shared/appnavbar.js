"use client";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getSession } from "@/lib/session";
import { useUser } from "@/app/providers/UserProvider";

const BASE_URL = process.env.NEXT_PUBLIC_ROOT_URL;
const Navbar = ({ isCoursePage }) => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      try {
        const session = await getSession();
        setUserType(session?.userType_id);

        if (user) {
          setUserDetails(user);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
      }
    };

    fetchSessionAndUser();
  }, [user]);

  const getUserRole = (userTypeId) => {
    switch (userTypeId) {
      case 1:
        return "Admin";
      case 2:
        return "Manager";
      case 3:
        console.log(userTypeId);
        return "Speaker";
      case 4:
        return "Student";
      default:
        return "Guest";
    }
  };

  const getProfilePath = (userTypeId) => {
    switch (userTypeId) {
      case 1:
      case 2:
        return "/dashboard/profile";
      case 3:
        return "/speaker/profile";
      case 4:
        return "/student/profile";
      default:
        return "/auth/signin";
    }
  };


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

          {!loading && userType && (
            <Button
              variant="ghost"
              className="hover:scale-105 transition-transform duration-200 w-full h-12"
              asChild
            >
              <Link href={getProfilePath(userType)}>
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={`${BASE_URL}profile_image_serve.php?image=${userDetails?.profile_image}`}
                    alt="Profile Image"
                  />

                  <AvatarFallback>
                    {userDetails?.first_name.charAt(0)}{" "}
                    {userDetails?.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <span className="ml-2 text-md">
                  {" "}
                  {userDetails?.first_name} {userDetails?.last_name}
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
