import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: GetQuestionsFilterDto) {
    const { area, topicId, difficulty, year, search, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.QuestionWhereInput = {
      status: 'PUBLISHED',
    };

    if (area) {
      where.area = area;
    }

    if (topicId) {
      where.topicId = topicId;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (year) {
      where.year = year;
    }

    if (search) {
      where.OR = [
        { stem: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.question.count({ where }),
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { code: 'asc' },
        include: {
          topic: { select: { id: true, name: true, slug: true } },
          _count: { select: { attempts: true } },
        },
      }),
    ]);

    const formatted = items.map((q) => ({
      id: q.id,
      code: q.code,
      area: q.area,
      topicName: q.topic.name,
      topicId: q.topic.id,
      difficulty: q.difficulty,
      year: q.year,
      source: q.source,
      status: q.status,
      stem: q.stem,
      attemptsCount: q._count.attempts,
    }));

    return {
      data: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        topic: true,
        alternatives: {
          orderBy: { letter: 'asc' },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada.');
    }

    return {
      id: question.id,
      code: question.code,
      stem: question.stem,
      area: question.area,
      topicName: question.topic.name,
      difficulty: question.difficulty,
      year: question.year,
      source: question.source,
      status: question.status,
      disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais.',
      alternatives: question.alternatives.map((alt) => ({
        id: alt.id,
        letter: alt.letter,
        text: alt.text,
        isCorrect: alt.isCorrect,
        explanation: alt.explanation,
      })),
    };
  }
}
