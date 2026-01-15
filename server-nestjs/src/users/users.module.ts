import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "./users.service";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], // so here User.name is used to register the model with mongoose why name because mongoose needs a string as model name can we keep anything in place of user.name  yes we can keep "User" as well
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}


// Explanation:
// 1. We import necessary modules and services including MongooseModule for database interaction.
// 2. We define a NestJS module using the @Module decorator.
// 3. In the imports array, we register the User model with Mongoose using MongooseModule.forFeature. This allows us to interact with the User collection in MongoDB.
// 4. We provide the UsersService in the providers array, making it available for dependency injection within this module.
// 5. We export the UsersService so that it can be used in other modules that import the UsersModule.
