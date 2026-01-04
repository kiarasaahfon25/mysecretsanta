import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Group from "@/models/group";


// GET /api/groups
export async function GET() {
  try {
    await connectDB();
    const groups = await Group.find().sort({ createdAt: -1 });

    return NextResponse.json({groups});
  } catch (error) {
    console.error("GET /api/groups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
//Post route
export async function POST(req: Request) {
    try {
      await connectDB(); 
    //Debug
    //const body = await req.json();
    // console.log("Received body:", body);
      
      const { name, participants } = await req.json();
  
      //ensure group name isnt empty
      if (!name || name.trim() === "") {
        return NextResponse.json(
          { error: "Group name is required." },
          { status: 400 }
        );
      }
  
      // Ensure group has at least 3 participants
      if (!participants || !Array.isArray(participants) || participants.length < 3) {
        return NextResponse.json(
          { error: "A group must have at least 3 participants." },
          { status: 400 }
        );
      }
  
     //Generate a token for each participant, this token will be used for participant links
      const participantsWithTokens = participants.map((p: any) => ({
        name: p.name,
        wishlist: [],
        wishlistSubmitted: false,
        token: crypto.randomUUID(), // unique token for participant link
      }));
  
      const group = await Group.create({
        name,
        participants: participantsWithTokens,
        drawStarted: false 
      });
  
      return NextResponse.json({ group }, { status: 201 });
    } catch (error) {
      console.error("Failed to create group:", error);
      return NextResponse.json(
        { error: "Failed to create group." },
        { status: 500 }
      );
    }
  }
