import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/group";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(
 req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {

  const group = await Group.findById((await params).groupId);
  if (!group) {
    return NextResponse.json(
      { error: "Group not found" },
      { status: 404 }
    );
  }

  // Prevent multiple draws
  if (group.drawStarted) {
    return NextResponse.json(
      { error: "Draw already started" },
      { status: 400 }
    );
  }

  const participants = group.participants;

  if (participants.length < 3) {
    return NextResponse.json(
      { error: "At least 3 participants required" },
      { status: 400 }
    );
  }

  const shuffled = [...participants].sort(() => Math.random() - 0.5); 
  // Math.Random gives number between 0 and 1 
  // if negative A goes before B, 
  // if positive B goes before A

  // Assign each participant a recipient
  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i];
    const receiver = shuffled[(i + 1) % shuffled.length]; // Always get the next person in the shuffled list, last person gets first person 

    giver.assignedTo = receiver._id;
  }

  group.drawStarted = true;

  await group.save();

  return NextResponse.json({
    message: "Draw started successfully",
  });
}
