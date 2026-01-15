import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChallengeParticipantDocument = ChallengeParticipant &
  Document & {
    createdAt?: Date;
    updatedAt?: Date;
  };

@Schema({ timestamps: true })
export class ChallengeParticipant {
  @Prop({ type: Types.ObjectId, ref: "Challenge", required: true }) 
  challengeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  totalPoints: number;
}

export const ChallengeParticipantSchema =
  SchemaFactory.createForClass(ChallengeParticipant);

// Create compound index for uniqueness
ChallengeParticipantSchema.index(
  { challengeId: 1, userId: 1 },
  { unique: true }
);
