import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(process.env.AUTH_TOKEN as string)?.value;

    const isAuthRoute = authRoutes.includes(pathname);

    if (token) {
        const isValidToken = await verifyToken(token);

        if (isValidToken) {
            if (isAuthRoute) {
                return NextResponse.redirect(new URL("/", request.url));
            }

            return NextResponse.next();
        }
    }

    if (isAuthRoute) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
