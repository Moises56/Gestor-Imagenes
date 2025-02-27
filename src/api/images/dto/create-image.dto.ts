import { IsString, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;
}
