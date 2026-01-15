import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/group";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  //const auth = requireAdmin(req); need to fix issue where it throws errors because of these 2 line
  //if (auth.error) return auth.error;

  await connectDB();
  const pgroupId = (await params).groupId
  const group = await Group.findById(pgroupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const participants = group.participants.map((p: any) => ({
    id: p._id,
    name: p.name,
    wishlistSubmitted: p.wishlistSubmitted,
    inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/participant/${pgroupId}/${p.token}/wishlist`,
  }));

  return NextResponse.json({
    deadline: group.deadline,
    drawStarted: group.drawStarted,
    participants,
  });
}

// Route to delete specific groups
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await Group.findById((await params).groupId);
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    await group.deleteOne();

    return NextResponse.json({ message: "Group deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /groups error:", error);
    return NextResponse.json(
      { error: "Server error deleting group" },
      { status: 500 }
    );
  }
}


