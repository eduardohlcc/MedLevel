import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAttemptDto {
  @ApiProperty({ example: 'alt_id_123' })
  @IsString()
  @IsNotEmpty()
  alternativeId: string;

  @ApiProperty({ example: 45, description: 'Tempo gasto na resolução em segundos' })
  @IsInt()
  @Min(0)
  durationSeconds: number;
}
