import mongoose, { Schema, models } from "mongoose";

export interface Participant {
    name: string;
    wishlist?: string[]; 
    wishlistSubmitted: Boolean,
    token: string;   // unique link for the participant
    createdAt?: Date;
    updatedAt?: Date;      
}

export const ParticipantSchema = new Schema({
    name: { type: String, required: true },
    wishlist: { type: [String], default: [] }, 
    token: { type: String, required: true },   
    wishlistSubmitted: {type: Boolean, required: true, defualt: false},
    assignedTo: { 
        type: Schema.Types.ObjectId, // stores another participant's _id 
        ref: "Participant", 
        default: null, },
  },
  { timestamps: true }
);
