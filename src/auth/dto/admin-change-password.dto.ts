import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class AdminChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
} 