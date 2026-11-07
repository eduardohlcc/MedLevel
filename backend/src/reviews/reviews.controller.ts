import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubmitGradeDto } from './dto/submit-grade.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('today')
  @ApiOperation({ summary: 'Obter caderno de erros com questões pendentes para hoje (SM-2)' })
  @ApiResponse({ status: 200, description: 'Fila de cartões de revisão do dia' })
  async getTodayReviews(@CurrentUser() user: any) {
    return this.reviewsService.getTodayReviews(user.id);
  }

  @Post(':id/grade')
  @ApiOperation({ summary: 'Submeter avaliação de retenção do cartão (SM-2 de 0 a 5)' })
  @ApiResponse({ status: 200, description: 'Cartão atualizado com nova data de vencimento' })
  async submitGrade(
    @CurrentUser() user: any,
    @Param('id') cardId: string,
    @Body() dto: SubmitGradeDto,
  ) {
    return this.reviewsService.submitGrade(user.id, cardId, dto);
  }
}
