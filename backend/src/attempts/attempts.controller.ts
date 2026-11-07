import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@ApiTags('Attempts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('questions/:id/attempt')
  @ApiOperation({ summary: 'Submeter resposta de questão e obter feedback/gabarito' })
  @ApiResponse({ status: 200, description: 'Resultado com gabarito e explicação comentada' })
  async createAttempt(
    @CurrentUser() user: any,
    @Param('id') questionId: string,
    @Body() dto: CreateAttemptDto,
  ) {
    return this.attemptsService.createAttempt(user.id, questionId, dto);
  }

  @Get('attempts/history')
  @ApiOperation({ summary: 'Histórico recente de tentativas do estudante' })
  async getUserAttempts(@CurrentUser() user: any) {
    return this.attemptsService.getUserAttempts(user.id);
  }
}
