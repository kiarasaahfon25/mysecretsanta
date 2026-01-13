import { NextRequest, NextResponse } from "next/server";
import Group from "@/models/group";
import { connectDB } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params:  Promise<{ groupId: string; participantId: string }> }
) {
  await connectDB();

  await Group.updateOne( 
    { _id: (await params).groupId }, 
    { $pull: { participants: { _id: (await params).participantId } } } ); // remove the participant with the associated id using pull

  return NextResponse.json({ success: true });
}
