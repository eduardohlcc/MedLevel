import { ApiProperty } from '@nestjs/swagger';
import { Difficulty, QuestionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AlternativeInputDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  letter: string;

  @ApiProperty({ example: 'Texto da alternativa...' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ example: 'Justificativa clínica detalhada...' })
  @IsString()
  @IsNotEmpty()
  explanation: string;
}

export class CreateQuestionAdminDto {
  @ApiProperty({ example: 'MED-NEW-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Paciente de 40 anos...' })
  @IsString()
  @IsNotEmpty()
  stem: string;

  @ApiProperty({ example: 'Clínica Médica' })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiProperty({ example: 'Cardiologia' })
  @IsString()
  @IsNotEmpty()
  topicName: string;

  @ApiProperty({ enum: Difficulty, default: Difficulty.MEDIUM })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ example: 2025 })
  @IsInt()
  year: number;

  @ApiProperty({ example: 'Banca Própria MedLevel' })
  @IsString()
  source: string;

  @ApiProperty({ enum: QuestionStatus, default: QuestionStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;

  @ApiProperty({ type: [AlternativeInputDto] })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => AlternativeInputDto)
  alternatives: AlternativeInputDto[];
}
