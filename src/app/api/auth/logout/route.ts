import { NextResponse } from "next/server";

export async function POST() {
  const userResponse = NextResponse.json({ message: "Logged out successfully" });
  userResponse.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return userResponse;
}
