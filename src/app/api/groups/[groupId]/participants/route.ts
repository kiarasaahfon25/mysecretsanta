import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Group from "@/models/group";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  await connectDB();
  
  const pgroupId = (await params).groupId
  const { name } = await req.json(); // extract name from json 
  const group = await Group.findById(pgroupId);
  const token = crypto.randomUUID();
  
  const newParticipant = {
    name,
    wishlist: [],
    wishlistSubmitted: false,
    token,
  };
  group.participants.push(newParticipant);
  await group.save();

  const created = group.participants[group.participants.length - 1].toObject(); 
  created._id = created._id.toString();
  
  return NextResponse.json({
    success: true,
    participant: {
      id: created._id.toString(),
      name: created.name,
      wishlist: created.wishlist,
      wishlistSubmitted: created.wishlistSubmitted,
      inviteUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/participant/${pgroupId}/${token}/wishlist`,
  },
});

//return NextResponse.json({ success: true, participant: created})

}