import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class UpdateStudyPlanDto {
  @ApiProperty({ example: '2026-11-20', description: 'Data prevista para o exame oficial' })
  @IsDateString()
  targetExamDate: string;

  @ApiProperty({ example: 20, description: 'Horas semanais dedicadas aos estudos' })
  @IsInt()
  @Min(5)
  @Max(80)
  weeklyHoursGoal: number;
}
