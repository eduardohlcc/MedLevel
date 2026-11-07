import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { StudyPlanService } from './study-plan.service';

@ApiTags('StudyPlan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('study-plan')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Obter metas de estudo, contagem regressiva e temas recomendados' })
  @ApiResponse({ status: 200, description: 'Plano de estudos atual' })
  async getStudyPlan(@CurrentUser() user: any) {
    return this.studyPlanService.getStudyPlan(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Atualizar data alvo do exame e meta semanal de horas' })
  async updateStudyPlan(@CurrentUser() user: any, @Body() dto: UpdateStudyPlanDto) {
    return this.studyPlanService.updateStudyPlan(user.id, dto);
  }
}
