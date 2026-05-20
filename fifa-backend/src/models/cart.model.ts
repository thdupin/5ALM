import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  id: string; // UUID
  cartId: string; // UUID
  matchId: string; // UUID
  seatId: string; // UUID
  price: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId; // Référence vers l'User
  expiresAt: Date;
  status: "active" | "expired" | "confirmed"; // Enum
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  id: { type: String, required: true },
  cartId: { type: String, required: true },
  matchId: { type: String, required: true },
  seatId: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired", "confirmed"], default: "active" },
  items: [cartItemSchema]
}, { timestamps: true });

// Index de suppression automatique de MongoDB quand le panier expire
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = model<ICart>("Cart", cartSchema);