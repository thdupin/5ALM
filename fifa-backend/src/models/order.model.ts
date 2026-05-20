import { Schema, model, Document, Types } from "mongoose";

export interface IPayment {
  id: string; // UUID
  orderId: string; // UUID
  amount: number;
  method: "credit_card" | "paypal" | "apple_pay"; // Enum
  status: "pending" | "completed" | "failed" | "refunded"; // Enum
  transactionId: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId; // Référence vers l'User
  totalAmount: number;
  status: "pending" | "paid" | "cancelled"; // Enum
  createdAt: Date;
  payment: IPayment;
}

const paymentSchema = new Schema<IPayment>({
  id: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["credit_card", "paypal", "apple_pay"], required: true },
  status: { type: String, enum: ["pending", "completed", "failed", "refunded"], required: true },
  transactionId: { type: String, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  payment: paymentSchema
}, { timestamps: true });

export const Order = model<IOrder>("Order", orderSchema);