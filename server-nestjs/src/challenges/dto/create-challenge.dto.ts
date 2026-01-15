import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from "class-validator";

export class CreateChallengeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  targetHabits?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  pointsPerDay?: number;
}
