import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/group";
import { connectDB } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteToken: string }> }
) {
  await connectDB();

  const { wishlist } = await req.json();

  if (!Array.isArray(wishlist) || wishlist.length !== 3) {
    return NextResponse.json(
      { error: "Wishlist must have exactly 3 items" },
      { status: 400 }
    );
  }

  const group = await Group.findOne({
    "participants.token": (await params).inviteToken,
  });

  if (!group) {
    return NextResponse.json(
      { error: "Invalid invite link" },
      { status: 404 }
    );
  }

  if (group.deadline && new Date() > group.deadline) {
    return NextResponse.json(
      { error: "Wishlist submission is closed" },
      { status: 403 }
    );
  }
  const participantToken = (await params).inviteToken

  const participant = group.participants.find(
     (p: any) => p.token === participantToken
  );

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  participant.wishlist = wishlist;
  participant.wishlistSubmitted = true;

  await group.save();

  return NextResponse.json({ 
    success: true,
  });
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ inviteToken: string }> }
) {
  await connectDB();

  const inviteToken = (await params).inviteToken;

  const group = await Group.findOne({
    "participants.token": inviteToken,
  });

  if (!group) {
    return NextResponse.json(
      { error: "Invalid invite link" },
      { status: 404 }
    );
  }

  const participant = group.participants.find(
    (p: any) => p.token === inviteToken
  );

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  // BEFORE DRAW
  if (!group.drawStarted) {
    return NextResponse.json({
      name: participant.name,
      wishlistSubmitted: participant.wishlistSubmitted,
      drawStarted: false,
    });
  }

  // AFTER DRAW
  const assigned = group.participants.find(
    (p: any) => p._id.equals(participant.assignedTo)
  );

  return NextResponse.json({
    name: participant.name,
    drawStarted: true,
    assignedTo: {
      name: assigned.name,
      wishlist: assigned.wishlist,
    },
  });
}

