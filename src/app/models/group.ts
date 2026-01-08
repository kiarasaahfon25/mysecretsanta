import mongoose, { Schema, models } from "mongoose";
import { Participant, ParticipantSchema } from "./participant";

export interface Group {
  name: string;
  participants: Participant[];
  createdAt?: Date;
  updatedAt?: Date;
  deadline: Date | null; 
  drawStarted: boolean;
  ownerId: Schema.Types.ObjectId;
}

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    participants: { type: [ParticipantSchema], required: true },
    deadline: { type: Date, required: false},
    drawStarted: {type: Boolean, required: true, defualt: false},
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    admins: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

  },
  { timestamps: true }
);

const Group = models.Group || mongoose.model("Group", GroupSchema);
export default Group;
