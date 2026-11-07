import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExamMode } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class StartExamDto {
  @ApiProperty({ enum: ExamMode, example: ExamMode.ENAMED_OFFICIAL })
  @IsEnum(ExamMode)
  mode: ExamMode;

  @ApiPropertyOptional({ example: 40, description: 'Número de questões no modo personalizado' })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  customQuestionCount?: number;

  @ApiPropertyOptional({
    example: ['Clínica Médica', 'Cirurgia'],
    description: 'Áreas selecionadas no modo personalizado',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedAreas?: string[];
}

export class SaveAnswerDto {
  @ApiProperty({ example: 'question-uuid' })
  @IsString()
  questionId: string;

  @ApiProperty({ example: 'alternative-uuid' })
  @IsString()
  alternativeId: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  flaggedForReview?: boolean;
}
