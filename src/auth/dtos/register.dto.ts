import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator'
export class RegisterDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}