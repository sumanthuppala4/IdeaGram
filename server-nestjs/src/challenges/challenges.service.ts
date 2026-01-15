import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Challenge, ChallengeDocument } from "./schemas/challenge.schema";
import {
  ChallengeParticipant,
  ChallengeParticipantDocument,
} from "./schemas/challenge-participant.schema";
import { CreateChallengeDto } from "./dto/create-challenge.dto";

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(ChallengeParticipant.name)
    private participantModel: Model<ChallengeParticipantDocument>
  ) {}

  async create(
    creatorId: string,
    createChallengeDto: CreateChallengeDto
  ): Promise<any> {
    const { startDate, endDate } = createChallengeDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException("End date must be after start date");
    }

    const challenge = new this.challengeModel({
      ...createChallengeDto,
      startDate: start,
      endDate: end,
      creatorId: new Types.ObjectId(creatorId),
      targetHabits: createChallengeDto.targetHabits || 1,
      pointsPerDay: createChallengeDto.pointsPerDay || 10,
    });

    const savedChallenge = await challenge.save();

    // Auto-join creator
    await this.joinChallenge(savedChallenge._id.toString(), creatorId);

    // Populate and format the response
    const populatedChallenge = await this.challengeModel
      .findById(savedChallenge._id)
      .populate("creatorId", "email username") 
      .exec();

    const challengeObj = populatedChallenge.toObject();
    const participantCount = await this.participantModel
      .countDocuments({ challengeId: savedChallenge._id })
      .exec();

    return {
      ...challengeObj,
      id: challengeObj._id.toString(),
      creatorName:
        (challengeObj.creatorId as any)?.username ||
        (challengeObj.creatorId as any)?.email ||
        "Unknown",
      participantCount,
    };
  }

  async findAll(): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const challenges = await this.challengeModel
      .find({
        status: "active",
        startDate: { $lte: endOfToday },
        endDate: { $gte: today },
      })
      .populate("creatorId", "email username")
      .sort({ createdAt: -1 })
      .exec();

    // Get participant counts for each challenge
    const challengeIds = challenges.map((c) => c._id);
    const participantCounts = await this.participantModel
      .aggregate([
        {
          $match: {
            challengeId: { $in: challengeIds },
          },
        },
        {
          $group: {
            _id: "$challengeId",
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const countMap = new Map(
      participantCounts.map((p) => [p._id.toString(), p.count])
    );

    return challenges.map((challenge) => {
      const challengeObj = challenge.toObject();
      return {
        ...challengeObj,
        id: challengeObj._id.toString(),
        creatorName:
          (challengeObj.creatorId as any)?.username ||
          (challengeObj.creatorId as any)?.email ||
          "Unknown",
        participantCount: countMap.get(challengeObj._id.toString()) || 0,
      };
    });
  }

  async findMyChallenges(userId: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // Find challenges where user is a participant
    const participants = await this.participantModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: "challengeId",
        populate: { path: "creatorId", select: "email username" },
      })
      .exec();

    const challenges = participants
      .map((p) => p.challengeId as any)
      .filter((challenge) => {
        if (!challenge || challenge.status !== "active") return false;
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(challenge.endDate);
        return startDate <= endOfToday && endDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

    // Get participant counts and user's points
    const challengeIds = challenges.map((c) => c._id);
    const participantCounts = await this.participantModel
      .aggregate([
        {
          $match: {
            challengeId: { $in: challengeIds },
          },
        },
        {
          $group: {
            _id: "$challengeId",
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const countMap = new Map(
      participantCounts.map((p) => [p._id.toString(), p.count])
    );

    // Get user's points for each challenge
    const userParticipants = await this.participantModel
      .find({
        userId: new Types.ObjectId(userId),
        challengeId: { $in: challengeIds },
      })
      .exec();

    const pointsMap = new Map(
      userParticipants.map((p) => [
        p.challengeId.toString(),
        p.totalPoints,
      ])
    );

    return challenges.map((challenge) => {
      const challengeObj = challenge.toObject ? challenge.toObject() : challenge;
      return {
        ...challengeObj,
        id: challengeObj._id.toString(),
        creatorName:
          (challengeObj.creatorId as any)?.username ||
          (challengeObj.creatorId as any)?.email ||
          "Unknown",
        participantCount: countMap.get(challengeObj._id.toString()) || 0,
        myPoints: pointsMap.get(challengeObj._id.toString()) || 0,
      };
    });
  }

  async findOne(id: string): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel
      .findById(id)
      .populate("creatorId", "email username")
      .exec();
    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }
    return challenge;
  }

  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    const challenge = await this.findOne(challengeId);

    // Check if challenge is active
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(challenge.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (today < startDate || today > endDate) {
      throw new BadRequestException("Challenge is not currently active");
    }

    // Check if already joined
    const existing = await this.participantModel
      .findOne({
        challengeId: new Types.ObjectId(challengeId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (existing) {
      throw new BadRequestException("Already joined this challenge");
    }

    const participant = new this.participantModel({
      challengeId: new Types.ObjectId(challengeId),
      userId: new Types.ObjectId(userId),
      totalPoints: 0,
    });

    await participant.save();
  }

  async leaveChallenge(challengeId: string, userId: string): Promise<void> {
    const challenge = await this.findOne(challengeId);

    // Check if user is creator (handle populated or raw ObjectId)
    const creator: any = challenge.creatorId as any;
    const creatorIdStr =
      creator instanceof Types.ObjectId
        ? creator.toString()
        : creator?._id?.toString?.() || creator?.toString?.() || "";

    if (creatorIdStr === userId) {
      throw new BadRequestException("Creator cannot leave the challenge");
    }

    const participant = await this.participantModel
      .findOne({
        challengeId: new Types.ObjectId(challengeId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!participant) {
      throw new BadRequestException("Not a participant of this challenge");
    }

    await participant.deleteOne();
  }

  async getParticipants(challengeId: string): Promise<any[]> {
    await this.findOne(challengeId);

    const participants = await this.participantModel
      .find({ challengeId: new Types.ObjectId(challengeId) })
      .populate("userId", "email username")
      .sort({ totalPoints: -1, createdAt: 1 })
      .exec();

    return participants.map((p) => ({
      id: p._id.toString(),
      userId: p.userId._id.toString(),
      username: (p.userId as any).username || (p.userId as any).email,
      email: (p.userId as any).email,
      totalPoints: p.totalPoints,
      joinedAt: p.createdAt || (p as any).createdAt,
    }));
  }

  async getScores(challengeId: string): Promise<any> {
    const challenge = await this.findOne(challengeId);

    const participants = await this.participantModel
      .find({ challengeId: new Types.ObjectId(challengeId) })
      .populate("userId", "email username")
      .sort({ totalPoints: -1, createdAt: 1 })
      .exec();

    return {
      challengeId: challenge._id.toString(),
      challengeName: challenge.name,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      totalParticipants: participants.length,
      participants: participants.map((p, index) => ({
        rank: index + 1,
        userId: p.userId._id.toString(),
        username: (p.userId as any).username || (p.userId as any).email,
        email: (p.userId as any).email,
        totalPoints: p.totalPoints,
        joinedAt: p.createdAt || (p as any).createdAt,
      })),
    };
  }
}
