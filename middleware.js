// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Get the pathname of the request
  const path = req.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/companion", "/quick-relief", "/analytics"];
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    const session = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If user is not logged in, redirect to signin page
    if (!session) {
      const url = new URL("/api/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/companion/:path*", "/quick-relief/:path*", "/analytics/:path*"],
};