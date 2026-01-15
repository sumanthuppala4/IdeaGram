import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // user.name is for the model name injection why name ?  because User is a class and we need the name property of the class but user has email passowrd username but why name because mongoose needs a string as model name can we keep anything in place of user.name  yes we can keep "User" as well

    private userModel: Model<UserDocument>
  ) {}

  async create(email: string, password?: string, username?: string): Promise<UserDocument> {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const user = new this.userModel({
      email,
      password: hashedPassword,
      username: username || email.split("@")[0],
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }
}
