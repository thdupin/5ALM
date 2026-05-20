import { Schema, model, Document } from "mongoose";

export interface ISeat {
  id: string; // UUID
  stadiumId: string; // UUID
  section: string;
  row: string;
  number: number;
}

export interface IMatch extends Document {
  teamA: string;
  teamB: string;
  round: string; // Enum
  group: string;
  date: Date;
  stadiumId: string; // UUID du stade de référence
  totalSeats: number;
  availableSeats: number;
  stadium: {
    name: string;
    city: string;
    country: string;
    capacity: number;
  };
  seats: ISeat[]; // Liste de tous les sièges du match
}

const seatSchema = new Schema<ISeat>({
  id: { type: String, required: true },
  stadiumId: { type: String, required: true },
  section: { type: String, required: true },
  row: { type: String, required: true },
  number: { type: Number, required: true }
}, { _id: false });

const matchSchema = new Schema<IMatch>({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  round: { type: String, required: true }, 
  group: { type: String, required: true },
  date: { type: Date, required: true },
  stadiumId: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  stadium: {
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    capacity: { type: Number, required: true }
  },
  seats: [seatSchema]
}, { timestamps: true });

export const Match = model<IMatch>("Match", matchSchema);