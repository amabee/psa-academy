import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Briefcase,
  DollarSign,
  LogOut,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GoPeople } from "react-icons/go";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions/auth";
import { useUser } from "@/app/providers/UserProvider";
import { toast } from "sonner";

const AppSidebar = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user, loading: userLoading } = useUser();

  const handleLogout = async () => {
    const { success, data, message } = await logout();
    if (!success) {
      toast.error("Failed to logout");
      return;
    }

    window.location.href = "/auth/signin";
  };

  const getUserRole = (userType) => {
    switch (userType) {
      case 1:
        return "admin";
      case 2:
        return "manager";
      case 3:
        return "teacher";
      case 4:
        return "student";
      default:
        return "guest";
    }
  };

  const navLinks = {
    student: [
      { icon: BookOpen, label: "Courses", href: "/student/courses" },
      { icon: User, label: "Profile", href: "/student/profile" },
    ],
    teacher: [
      { icon: BookOpen, label: "Courses", href: "/speaker/courses" },
      { icon: User, label: "Profile", href: "/speaker/profile" },
      {
        icon: GoPeople,
        label: "Enrolled Students",
        href: "/speaker/course-list",
      },
    ],
    admin: [
      { icon: BookOpen, label: "Courses", href: "/admin/courses" },
      { icon: User, label: "Profile", href: "/admin/profile" },
    ],
    manager: [
      { icon: BookOpen, label: "Courses", href: "/manager/courses" },
      { icon: User, label: "Profile", href: "/manager/profile" },
    ],
    guest: [
      { icon: BookOpen, label: "Courses", href: "/courses" },
      { icon: User, label: "Profile", href: "/profile" },
    ],
  };

  if (userLoading) {
    return (
      <div className="flex h-screen w-16 items-center justify-center bg-customgreys-primarybg">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const userRole = getUserRole(user.userType_id);
  const currentNavLinks = navLinks[userRole] || navLinks.guest;

  return (
    <Sidebar
      collapsible="icon"
      style={{ height: "100vh" }}
      className="bg-customgreys-primarybg border-none shadow-lg"
    >
      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-customgreys-secondarybg"
            >
              <div className="app-sidebar__logo-container group">
                <div className="app-sidebar__logo-wrapper">
                  <Image
                    src="/images/finalchuyans.png"
                    alt="logo"
                    width={25}
                    height={20}
                    className="app-sidebar__logo"
                  />
                  <p className="app-sidebar__title">PSA ACADEMY</p>
                </div>
                <PanelLeft className="app-sidebar__collapse-icon" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {currentNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "app-sidebar__nav-item",
                  isActive && "bg-gray-800"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "app-sidebar__nav-button",
                    !isActive && "text-customgreys-dirtyGrey"
                  )}
                >
                  <Link
                    href={link.href}
                    className="app-sidebar__nav-link"
                    scroll={false}
                  >
                    <link.icon
                      className={isActive ? "text-white-50" : "text-gray-500"}
                    />
                    <span
                      className={cn(
                        "app-sidebar__nav-text",
                        isActive ? "text-white-50" : "text-gray-500"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-sidebar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="outline"
                onClick={() => handleLogout()}
                className="group border-2 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20"
              >
                <LogOut className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />
                <span>Sign out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
