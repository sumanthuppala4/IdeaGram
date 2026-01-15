import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChallengesService } from "./challenges.service";
import { ChallengesController } from "./challenges.controller";
import { Challenge, ChallengeSchema } from "./schemas/challenge.schema";
import {
  ChallengeParticipant,
  ChallengeParticipantSchema,
} from "./schemas/challenge-participant.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: ChallengeParticipant.name, schema: ChallengeParticipantSchema },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
