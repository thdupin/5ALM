import { Schema, model, Document, Types } from "mongoose";

export interface ITicket extends Document {
  orderId: Types.ObjectId; // Référence vers l'Order
  matchId: Types.ObjectId; // Référence vers le Match
  seatId: string;          // UUID du siège
  qrCode: string;          // Chaîne de caractères brute pour générer le QR
  status: "valid" | "used" | "cancelled"; // Enum
}

const ticketSchema = new Schema<ITicket>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  seatId: { type: String, required: true },
  qrCode: { type: String, required: true, unique: true },
  status: { type: String, enum: ["valid", "used", "cancelled"], default: "valid" }
}, { timestamps: true });

export const Ticket = model<ITicket>("Ticket", ticketSchema);