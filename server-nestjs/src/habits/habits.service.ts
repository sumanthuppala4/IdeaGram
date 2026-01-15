import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Habit, HabitDocument } from "./schemas/habit.schema";
import { HabitLog, HabitLogDocument } from "./schemas/habit-log.schema";
import { CreateHabitDto } from "./dto/create-habit.dto";
import { UpdateHabitDto } from "./dto/update-habit.dto";
import { CompleteHabitDto } from "./dto/complete-habit.dto";

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name)
    private habitModel: Model<HabitDocument>,
    @InjectModel(HabitLog.name)
    private habitLogModel: Model<HabitLogDocument>
  ) {}

  async create(userId: string, createHabitDto: CreateHabitDto): Promise<HabitDocument> {
    const habit = new this.habitModel({
      ...createHabitDto,
      userId: new Types.ObjectId(userId),
    });
    return habit.save();
  }

  async findAll(userId: string): Promise<HabitDocument[]> {
    return this.habitModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTodayStatus(userId: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const habits = await this.habitModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    const habitIds = habits.map((h) => h._id);

    const completedLogs = await this.habitLogModel
      .find({
        userId: new Types.ObjectId(userId),
        habitId: { $in: habitIds },
        completedDate: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    const completedHabitIds = new Set(
      completedLogs.map((log) => log.habitId.toString())
    );

    return habits.map((habit) => ({
      id: habit._id.toString(),
      name: habit.name,
      description: habit.description,
      completed: completedHabitIds.has(habit._id.toString()),
    }));
  }

  async findOne(id: string, userId: string): Promise<HabitDocument> {
    const habit = await this.habitModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (!habit) {
      throw new NotFoundException("Habit not found");
    }
    return habit;
  }

  async update(
    id: string,
    userId: string,
    updateHabitDto: UpdateHabitDto
  ): Promise<HabitDocument> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, updateHabitDto);
    return habit.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const habit = await this.findOne(id, userId);
    await habit.deleteOne();
  }

  async completeHabit(
    id: string,
    userId: string,
    completeHabitDto: CompleteHabitDto
  ): Promise<HabitLogDocument> {
    const habit = await this.findOne(id, userId);

    const completedDate = completeHabitDto.date
      ? new Date(completeHabitDto.date)
      : new Date();
    completedDate.setHours(0, 0, 0, 0);

    // Check if already completed for this date
    const existingLog = await this.habitLogModel
      .findOne({
        habitId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        completedDate: {
          $gte: new Date(completedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(completedDate.setHours(23, 59, 59, 999)),
        },
      })
      .exec();

    if (existingLog) {
      throw new BadRequestException(
        "Habit already completed for this date"
      );
    }

    const habitLog = new this.habitLogModel({
      habitId: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
      completedDate,
      points: 10,
    });

    return habitLog.save();
  }

  async getWeeklyStats(
    id: string,
    userId: string,
    startDate?: string
  ): Promise<any> {
    const habit = await this.findOne(id, userId);

    // Calculate week start (Monday)
    const today = startDate ? new Date(startDate) : new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const logs = await this.habitLogModel
      .find({
        habitId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        completedDate: {
          $gte: weekStart,
          $lte: weekEnd,
        },
      })
      .sort({ completedDate: 1 })
      .exec();

    // Create stats for each day of the week
    const stats = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const log = logs.find((l) => {
        const logDate = new Date(l.completedDate);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });

      stats.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: !!log,
        points: log ? log.points : 0,
      });
    }

    return {
      habitId: id,
      habitName: habit.name,
      weekStart: weekStart.toISOString().split("T")[0],
      weekEnd: weekEnd.toISOString().split("T")[0],
      totalCompleted: logs.length,
      totalPoints: logs.reduce((sum, log) => sum + log.points, 0),
      dailyStats: stats,
    };
  }
}
