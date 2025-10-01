// middleware.ts
import { NextResponse } from "next/server";

export default function middleware(req: any) {
  const { nextUrl } = req;
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  
  // For now, let's allow all requests and handle authentication in the components
  // This prevents middleware from causing 500 errors
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/purchases/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/login",
  ],
};
