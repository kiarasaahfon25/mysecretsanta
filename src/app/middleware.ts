import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromRequest } from "./lib/getUsersFromRequest"; // adjust path

export function middleware(req: NextRequest) {
  // Only protect certain paths
  const protectedPaths = ["/admin", "/groups", "/participants", "/draw"];
  const pathname = req.nextUrl.pathname;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Allow request to continue
  return NextResponse.next();
}
