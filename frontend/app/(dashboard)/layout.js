"use client";
import AppSidebar from "@/components/shared/appsidebar";
import Navbar from "@/components/shared/appnavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./student/courses/[courseId]/ChapterSideBar";
import "./dashboard_css.css"

export default function DashboardLayout(props) {
  const { children } = props;
  const pathname = usePathname();
  const [courseId, setCourseId] = useState(null);
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId("3a9f3d6c-c391-4b1c-9c3d-6c3f3d6c3f3d");
    }
  }, [isCoursePage, pathname]);

  return (
    <SidebarProvider>
      <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
          {courseId && <ChaptersSidebar />}
          <div
            className={cn(
              "dashboard__main",
              isCoursePage && "dashboard__main--not-course"
            )}
            style={{ height: "100vh" }}
          >
            <Navbar isCoursePage={isCoursePage} />
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
