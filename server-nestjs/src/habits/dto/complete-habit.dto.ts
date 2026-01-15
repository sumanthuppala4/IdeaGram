import { IsOptional, IsDateString } from "class-validator";

export class CompleteHabitDto {
  @IsOptional()
  @IsDateString()
  date?: string; // Optional, defaults to today
}
