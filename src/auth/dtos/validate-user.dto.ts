import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateUserDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}