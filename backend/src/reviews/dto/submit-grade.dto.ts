import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SubmitGradeDto {
  @ApiProperty({
    example: 4,
    minimum: 0,
    maximum: 5,
    description:
      'Avaliação da retenção SM-2: 0 (apagão completo) a 5 (recordação perfeita e imediata)',
  })
  @IsInt()
  @Min(0)
  @Max(5)
  grade: number;
}
