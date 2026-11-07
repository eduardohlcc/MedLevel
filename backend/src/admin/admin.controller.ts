import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { CreateQuestionAdminDto } from './dto/create-question.dto';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@Controller('admin/questions')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova questão médica (Apenas Administradores)' })
  @ApiResponse({ status: 201, description: 'Questão cadastrada' })
  async createQuestion(@Body() dto: CreateQuestionAdminDto) {
    return this.adminService.createQuestion(dto);
  }

  @Post('import')
  @ApiOperation({ summary: 'Importação em lote de questões via JSON' })
  @ApiResponse({ status: 201, description: 'Lote importado com sucesso' })
  async importQuestions(@Body() questions: CreateQuestionAdminDto[]) {
    return this.adminService.importQuestions(questions);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar status de publicação da questão (DRAFT, REVIEWED, PUBLISHED)' })
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.adminService.updateQuestionStatus(id, status);
  }
}
