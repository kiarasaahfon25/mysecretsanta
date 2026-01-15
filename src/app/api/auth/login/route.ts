/*import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import {User} from "@/models/user";
import { loginSchema } from "@/lib/validators";
import { SESSION_DURATION, signToken } from "@/lib/auth";

// POST /api/auth/login
export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
     
    
    // Find user by email
    const user = await User.findOne({ email });


    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
   

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = signToken({ userId: user._id, role: user.role });

    const userResponse = NextResponse.json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
    
    userResponse.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: SESSION_DURATION,
    });

    return userResponse;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
*/