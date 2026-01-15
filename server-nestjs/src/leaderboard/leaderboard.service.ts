import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  ChallengeParticipant,
  ChallengeParticipantDocument,
} from "../challenges/schemas/challenge-participant.schema";
import { User, UserDocument } from "../users/schemas/user.schema";

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(ChallengeParticipant.name) 
    private participantModel: Model<ChallengeParticipantDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  async getGlobalLeaderboard(limit = 100) {
    const agg = await this.participantModel
      .aggregate([
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: "$totalPoints" },
          },
        },
        { $sort: { totalPoints: -1, _id: 1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            username: { $ifNull: ["$user.username", "$user.email"] },
            email: "$user.email",
            totalPoints: 1,
          },
        },
      ])
      .exec();

    // add ranks
    return agg.map((entry, idx) => ({
      rank: idx + 1,
      ...entry,
    }));
  }

  async getMyStats(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const my = await this.participantModel
      .aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: "$totalPoints" },
          },
        },
      ])
      .exec();

    const myPoints = my.length ? my[0].totalPoints : 0;

    // rank: count users with higher points + 1
    const higherCount = await this.participantModel
      .aggregate([
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: "$totalPoints" },
          },
        },
        { $match: { totalPoints: { $gt: myPoints } } },
        { $count: "higher" },
      ])
      .exec();

    const rank = higherCount.length ? higherCount[0].higher + 1 : 1;

    return { totalPoints: myPoints, rank };
  }
}
