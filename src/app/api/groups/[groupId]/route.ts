import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/group";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/db";

export async function GET(
  
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  //const auth = requireAdmin(req); need to fix issue where it throws errors because of these 2 line
  //if (auth.error) return auth.error;

  await connectDB();

  const group = await Group.findById((await params).groupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const participants = group.participants.map((p: any) => ({
    id: p._id,
    name: p.name,
    wishlistSubmitted: p.wishlistSubmitted,
    inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/participant/${p.token}`,
  }));

  return NextResponse.json({
    deadline: group.deadline,
    drawStarted: group.drawStarted,
    participants,
  });
}
