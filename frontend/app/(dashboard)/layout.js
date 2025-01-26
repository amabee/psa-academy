"use client";
import AppSidebar from "@/components/shared/appsidebar";
import Navbar from "@/components/shared/appnavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "../providers/UserProvider";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChaptersSidebar from "./student/courses/[courseId]/ChapterSideBar";
import "./dashboard_css.css";
import { LoadingOverlay } from "@/components/shared/loadingoverlay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export default function DashboardLayout(props) {
  const { children } = props;
  const pathname = usePathname();
  const [courseId, setCourseId] = useState(null);
  const { user, loading } = useUser();

  const isCoursePage =
    /^\/student\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(pathname);

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/student\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId(null);
    }
  }, [isCoursePage, pathname]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
        <Toaster richColors closeButton />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
