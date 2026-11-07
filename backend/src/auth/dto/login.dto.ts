import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'estudante@medlevel.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Senha123#' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'estudante@medlevel.com.br' })
  @IsEmail()
  email: string;
}
