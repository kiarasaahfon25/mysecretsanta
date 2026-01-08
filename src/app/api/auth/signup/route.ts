import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import {User} from "@/models/user";
import { signupSchema } from "@/lib/validators";

// POST /api/auth/signup
export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();
    // Parse JSON body
    const body = await req.json();

    // Validate input
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", 
    });
    
    return NextResponse.json({ 
      message: "Signup successful", 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
