import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Dra. Camila Rocha' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'camila@exemplo.med.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SenhaForte#2026', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '2026-11-20' })
  @IsOptional()
  @IsString()
  targetExamDate?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  weeklyHoursGoal?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  termsAccepted: boolean;
}
