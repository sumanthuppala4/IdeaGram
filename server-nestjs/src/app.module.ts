import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HabitsModule } from "./habits/habits.module";
import { ChallengesModule } from "./challenges/challenges.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    HabitsModule,
    ChallengesModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
