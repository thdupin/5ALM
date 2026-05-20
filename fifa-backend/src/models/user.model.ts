import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  twoFASecret?: string;
  isVerified: boolean;
  role: "supporter" | "admin";
  permissions?: string[]; // Spécifique à la classe Admin (extends)
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["supporter", "admin"], default: "supporter" },
  permissions: { type: [String], default: [] } // Rempli si role === 'admin'
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);