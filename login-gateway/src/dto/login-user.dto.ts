import { IsNotEmpty, IsStrongPassword, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}