import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveAnswerDto, StartExamDto } from './dto/start-exam.dto';
import { ExamsService } from './exams.service';

@ApiTags('Exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar nova sessão de simulado (ENAMED Oficial ou Personalizado)' })
  @ApiResponse({ status: 201, description: 'Sessão de simulado criada com cronômetro ativo' })
  async startExam(@CurrentUser() user: any, @Body() dto: StartExamDto) {
    return this.examsService.startExam(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperar estado da sessão do simulado em andamento' })
  async getExamSession(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examsService.getExamSession(user.id, id);
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Salvar resposta de uma questão no simulado' })
  async saveAnswer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: SaveAnswerDto,
  ) {
    return this.examsService.saveAnswer(user.id, id, dto);
  }

  @Post(':id/finish')
  @ApiOperation({ summary: 'Finalizar simulado e calcular resultado' })
  async finishExam(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examsService.finishExam(user.id, id);
  }

  @Get(':id/report')
  @ApiOperation({ summary: 'Obter relatório de desempenho detalhado do simulado' })
  async getExamReport(@CurrentUser() user: any, @Param('id') id: string) {
    return this.examsService.getExamReport(user.id, id);
  }
}
