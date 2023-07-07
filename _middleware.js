import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {

   // token will exist if the user is logged in
   const token = await getToken({ req, secret: process.env.JWT_SECRET });

   const { pathname } = req.nextUrl;

   // Allow the requests if:
   // 1) the token exists
   if (pathname.includes("/api/auth") || token) {
      return NextResponse.next();
   }

   // redirect the user to login if 
   // they don't have token,
   // and requesting a protected route
   if (!token && pathname !== "/login") {
      return NextResponse.redirect("/login");
   }
}