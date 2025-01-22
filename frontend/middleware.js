import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // console.log(`Middleware processing route: ${pathname}`);

  if (
    pathname.startsWith("/auth/") &&
    pathname !== "/auth/signin" &&
    pathname !== "/auth/signup"
  ) {
    return NextResponse.next();
  }

  try {
    const session = await getSession();

    const routeConfig = {
      student: {
        pattern: /^\/student(\/.*)?$/,
        allowedTypes: [4],
        defaultRedirect: "/student/courses",
      },
      speaker: {
        pattern: /^\/speaker(\/.*)?$/,
        allowedTypes: [3],
        defaultRedirect: "/speaker/courses",
      },
      dashboard: {
        pattern: /^\/dashboard(\/.*)?$/,
        allowedTypes: [1, 2, 3, 4],
        defaultRedirect: "/dashboard",
      },
    };

    if (session?.isAuthenticated) {
      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        const redirectUrl = getRedirectUrlForUserType(
          session.userType_id,
          request.url
        );
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      for (const [key, config] of Object.entries(routeConfig)) {
        if (config.pattern.test(pathname)) {
          if (!config.allowedTypes.includes(session.userType_id)) {
            const redirectUrl = getRedirectUrlForUserType(
              session.userType_id,
              request.url
            );
            return NextResponse.redirect(new URL(redirectUrl, request.url));
          }
        }
      }
    } else {
      // Only redirect to signin if trying to access protected routes
      const isProtectedRoute =
        Object.values(routeConfig).some((config) =>
          config.pattern.test(pathname)
        ) || pathname === "/";

      if (isProtectedRoute && pathname !== "/auth/signin") {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware error:", e);
    if (pathname !== "/auth/signin") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }
}

function getRedirectUrlForUserType(userType, baseUrl) {
  switch (userType) {
    case 1:
      "/welcome";
      return;
    case 2:
      "/welcome";
      return;
    case 3:
      return "/speaker/courses";
    case 4:
      return "/student/courses";
    default:
      return "/dashboard";
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/student/:path*",
    "/speaker/:path*",
    "/auth/:path*",
  ],
};
