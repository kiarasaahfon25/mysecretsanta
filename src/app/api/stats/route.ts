import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Group from "@/models/group";
import { authOptions } from "@/lib/authOptions";

// GET /api/stats
export async function GET() {
  try {
    
    await connectDB();
    const session = await getServerSession(authOptions);//await session before accessing its properties

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const userId = session.user.id;

    const groups = await Group.find({
        $or: [
          { ownerId: userId },
          { adminIds: userId },
        ],
      }).sort({ createdAt: -1 });;


    const currentYear = new Date().getFullYear();

    const currentYearGroups = groups.filter(
      (group) =>
        new Date(group.createdAt).getFullYear() === currentYear
    );

    const previousGroups = groups.filter(
      (group) =>
        new Date(group.createdAt).getFullYear() !== currentYear
    );

    const buildStats = (groupList: any[]) => {
      const totalParticipants = groupList.reduce(
        (acc, group) => acc + group.participants.length,
        0
      );

      return {
        totalGroups: groupList.length,
        totalParticipants,
        avgGroupSize:
          groupList.length > 0
            ? Math.round(totalParticipants / groupList.length)
            : 0,
      };
    };

    return NextResponse.json({
      currentYear,
      currentYearStats: buildStats(currentYearGroups),
      previousYearsStats: buildStats(previousGroups),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}