import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { HabitsService } from "./habits.service";
import { CreateHabitDto } from "./dto/create-habit.dto";
import { UpdateHabitDto } from "./dto/update-habit.dto";
import { CompleteHabitDto } from "./dto/complete-habit.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("habits")
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Request() req, @Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(req.user.userId, createHabitDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.habitsService.findAll(req.user.userId);
  }

  @Get("today/status")
  getTodayStatus(@Request() req) {
    return this.habitsService.getTodayStatus(req.user.userId);
  }

  @Get(":id")
  findOne(@Request() req, @Param("id") id: string) {
    return this.habitsService.findOne(id, req.user.userId);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateHabitDto: UpdateHabitDto
  ) {
    return this.habitsService.update(id, req.user.userId, updateHabitDto);
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    return this.habitsService.remove(id, req.user.userId);
  }

  @Post(":id/complete")
  complete(
    @Request() req,
    @Param("id") id: string,
    @Body() completeHabitDto: CompleteHabitDto
  ) {
    return this.habitsService.completeHabit(
      id,
      req.user.userId,
      completeHabitDto
    );
  }

  @Get(":id/stats/weekly")
  getWeeklyStats(
    @Request() req,
    @Param("id") id: string,
    @Query("startDate") startDate?: string
  ) {
    return this.habitsService.getWeeklyStats(id, req.user.userId, startDate);
  }
}
