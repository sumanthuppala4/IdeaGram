import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          "MONGODB_URI",
          "mongodb://localhost:27017/habit-challenge"
        ),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}


// Explanation:
// 1. We import necessary modules including MongooseModule for database interaction and ConfigModule for accessing environment variables.
// 2. We define a NestJS module using the @Module decorator.
// 3. In the imports array, we configure MongooseModule to connect to MongoDB asynchronously using forRootAsync. This allows us to use ConfigService to fetch the MongoDB URI from environment variables.
// 4. We provide a default URI in case the environment variable is not set.
// 5. We inject ConfigService to access configuration values within the useFactory function.