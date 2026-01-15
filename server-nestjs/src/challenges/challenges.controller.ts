import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ChallengesService } from "./challenges.service";
import { CreateChallengeDto } from "./dto/create-challenge.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("challenges")
@UseGuards(JwtAuthGuard) // Protect all routes in this controller with JWT authentication
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Request() req, @Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(req.user.userId, createChallengeDto);
  }

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Get("my-challenges")
  findMyChallenges(@Request() req) {
    return this.challengesService.findMyChallenges(req.user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.challengesService.findOne(id);
  }

  @Post(":id/join")
  async join(@Request() req, @Param("id") id: string) {
    await this.challengesService.joinChallenge(id, req.user.userId);
    return { message: "Successfully joined the challenge" };
  }

  @Delete(":id/leave")
  async leave(@Request() req, @Param("id") id: string) {
    await this.challengesService.leaveChallenge(id, req.user.userId);
    return { message: "Successfully left the challenge" };
  }

  @Get(":id/participants")
  getParticipants(@Param("id") id: string) {
    return this.challengesService.getParticipants(id);
  }

  @Get(":id/scores")
  getScores(@Param("id") id: string) {
    return this.challengesService.getScores(id);
  }
}
