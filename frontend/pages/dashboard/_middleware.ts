import type { NextApiResponse } from "next";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { jwtVerify as verify } from "jose";

enum Route {
    Dashboard = "/dashboard",
}

type Routes = {
    [key in Route]: { fail: string | URL; success?: string | URL };
};

const middleware = async (req: NextRequest, e: NextFetchEvent) => {
    // should authenticate with isAuthenticated
    const clientURL = process.env.NEXT_PUBLIC_URL;
    const { cookies, nextUrl } = req;

    const url = nextUrl.pathname;

    const routes: Routes = {
        "/dashboard": { fail: "/login" },
    };

    const route = (Object.keys(routes) as Array<Route>).find((route) =>
        url.includes(route)
    );
    if (!route) return NextResponse.next();
    const routeObj = routes[route];
    const token = cookies?.token || null;
    if (!token) return NextResponse.redirect(new URL(routeObj.fail, clientURL));

    try {
        await verify(
            token,
            new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
        );
        if (routeObj?.success) {
            return NextResponse.redirect(new URL(routeObj.success, clientURL));
        }
        return NextResponse.next();
    } catch (err) {
        console.log(err);
        return NextResponse.redirect(new URL(routeObj.fail, clientURL));
    }
};

export default middleware;