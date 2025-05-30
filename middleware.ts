import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req : NextRequest){
    const token = await getToken({req, secret : process.env.NEXTAUTH_SECRET});
    const {pathname} = req.nextUrl;
    if(!token)
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}signin`,req.url));

    const role = token?.role;
    if(pathname.startsWith('Admin')  && role != 'admin')
        return  NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}signin`,req.url));
    if(pathname.startsWith('Employee')  && role != 'employee')
        return  NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_WEBSITE_URL}signin`,req.url));
    return NextResponse.next();
}

export const config = {
  matcher: ["/Admin/:path*", "/Employee/:path*","/Admin","/Employee","/Website"],
};