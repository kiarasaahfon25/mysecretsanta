import mongoose, { Schema, model, models } from "mongoose";

export interface User {
  name: string; 
  email: string;
  password: string; // hashed password
  role: "admin";    //every one who signs in is an admin. Their dashboard belongs to them (they are the admin of their dashbaord, need to work on feature to have multiple admins)
  createdAt?: Date;
}

const userSchema = new Schema<User>({
  name: { type: String, required: false, unique: false},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

// If Usermodel already exists use it instead of creating a new one, if it does not exist create a new one
export const User = models.User || model<User>("User", userSchema);
