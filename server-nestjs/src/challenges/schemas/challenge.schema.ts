import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  creatorId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ default: 1 })
  targetHabits: number;

  @Prop({ default: 10 })
  pointsPerDay: number;

  @Prop({ default: "active" })
  status: string;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);


// Difference between schema and DTO is 
