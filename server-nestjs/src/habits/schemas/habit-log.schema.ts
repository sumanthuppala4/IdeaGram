import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type HabitLogDocument = HabitLog & Document;

@Schema({ timestamps: true })
export class HabitLog {
  @Prop({ type: Types.ObjectId, ref: "Habit", required: true })
  habitId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  completedDate: Date;

  @Prop({ default: 10 })
  points: number;
}

export const HabitLogSchema = SchemaFactory.createForClass(HabitLog);

// Create compound index for uniqueness
HabitLogSchema.index({ habitId: 1, userId: 1, completedDate: 1 }, { unique: true });
