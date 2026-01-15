import { Controller, Get, UseGuards, Request, Query } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("leaderboard")
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get("global")  // endpoint to get global leaderboard
  getGlobal(@Query("limit") limit?: string) { // you can use any name in place of getGlobal
    const parsed = limit ? parseInt(limit, 10) : 100;
    return this.leaderboardService.getGlobalLeaderboard( 
      isNaN(parsed) ? 100 : parsed
    );
  }

  @Get("my-stats")
  getMyStats(@Request() req) {
    return this.leaderboardService.getMyStats(req.user.userId);
  }
}
