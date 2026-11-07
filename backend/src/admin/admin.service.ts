import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionAdminDto } from './dto/create-question.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(dto: CreateQuestionAdminDto) {
    // Find or create topic
    let topic = await this.prisma.topic.findFirst({
      where: { name: { equals: dto.topicName, mode: 'insensitive' } },
    });

    if (!topic) {
      const slug = dto.topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      topic = await this.prisma.topic.create({
        data: {
          name: dto.topicName,
          slug: `${slug}-${Date.now()}`,
        },
      });
    }

    const question = await this.prisma.question.create({
      data: {
        code: dto.code,
        stem: dto.stem,
        area: dto.area,
        topicId: topic.id,
        difficulty: dto.difficulty,
        year: dto.year,
        source: dto.source,
        status: dto.status || 'PUBLISHED',
        alternatives: {
          create: dto.alternatives.map((alt) => ({
            letter: alt.letter,
            text: alt.text,
            isCorrect: alt.isCorrect,
            explanation: alt.explanation,
          })),
        },
      },
      include: {
        alternatives: true,
        topic: true,
      },
    });

    return question;
  }

  async importQuestions(questions: CreateQuestionAdminDto[]) {
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException('Formato de lote inválido ou vazio.');
    }

    const results = [];
    for (const q of questions) {
      const created = await this.createQuestion(q);
      results.push(created);
    }

    return {
      message: `${results.length} questões importadas com sucesso.`,
      count: results.length,
    };
  }

  async updateQuestionStatus(id: string, status: any) {
    return this.prisma.question.update({
      where: { id },
      data: { status },
    });
  }
}
