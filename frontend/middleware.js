import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

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
      resourcePerson: {
        pattern: /^\/resource-person(\/.*)?$/,
        allowedTypes: [2],
        defaultRedirect: "/resource-person",
      },
      dashboard: {
        pattern: /^\/dashboard(\/.*)?$/,
        allowedTypes: [1, 2, 3, 4],
        defaultRedirect: "/dashboard",
      },
    };

    if (!session?.isAuthenticated) {
      const response = NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );

      response.cookies.set("clear-user-data", "true", {
        httpOnly: false,
        path: "/",
        maxAge: 10,
      });

      const isProtectedRoute =
        Object.values(routeConfig).some((config) =>
          config.pattern.test(pathname)
        ) || pathname === "/";

      if (isProtectedRoute && pathname !== "/auth/signin") {
        return response;
      }
    }

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
    }

    return NextResponse.next();
  } catch (e) {
    if (pathname !== "/auth/signin") {
      const response = NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );
      response.cookies.set("clear-user-data", "true", {
        httpOnly: false,
        path: "/",
        maxAge: 10,
      });

      return response;
    }
    return NextResponse.next();
  }
}

function getRedirectUrlForUserType(userType, baseUrl) {
  switch (userType) {
    case 1:
      return "/admin";
    case 2:
      return "/resource-person";
    case 3:
      return "/speaker/courses";
    case 4:
      return "/student/courses";
    default:
      return "/welcome";
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/student/:path*",
    "/speaker/:path*",
    "/resource-person/:path*",
    "/auth/:path*",
  ],
};
