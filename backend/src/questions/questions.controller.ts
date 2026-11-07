import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { QuestionsService } from './questions.service';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar questões com filtros combinados e paginação' })
  @ApiResponse({ status: 200, description: 'Lista paginada de questões' })
  async findAll(@Query() filter: GetQuestionsFilterDto) {
    return this.questionsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter enunciado e alternativas de uma questão' })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }
}
