import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class UpdateHabitDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
