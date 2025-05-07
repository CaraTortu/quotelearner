import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function authMiddleware(request: NextRequest) {
    const session = getSessionCookie(request);

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    //TODO: Update this to practise and quote management
    matcher: ["/dashboard/:path*", "/account", "/admin/:path*"],
};
