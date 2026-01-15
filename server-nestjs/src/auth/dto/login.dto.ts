import { IsEmail, IsString, IsOptional } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString() 
  @IsOptional()
  password?: string; 
}
