import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
//make sure that participants do not get access to admin dashboard
//needed for routes/pages that require admin role (login, signup, create/list groups, add/delete participants, start a draw, basically make sure only admin is doing admin things. Might not really need in login and signup)
export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded; // contains userId and role
}