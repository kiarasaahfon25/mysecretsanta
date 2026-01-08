/*import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "./getUsersFromRequest";

export function requireAdmin(req: NextRequest) {
  const user = getUserFromRequest(req);

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
*/