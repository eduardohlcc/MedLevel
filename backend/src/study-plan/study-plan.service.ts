import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';

@Injectable()
export class StudyPlanService {
  constructor(private prisma: PrismaService) {}

  async getStudyPlan(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        targetExamDate: true,
        weeklyHoursGoal: true,
      },
    });

    const targetDate = user?.targetExamDate || new Date('2026-11-20');
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Fetch topics where user has active review cards (weak areas)
    const reviewCards = await this.prisma.reviewCard.findMany({
      where: { userId },
      include: {
        question: {
          include: { topic: true },
        },
      },
      take: 5,
    });

    const suggestedTopics = reviewCards.map((rc) => ({
      id: rc.question.topicId,
      topicName: rc.question.topic.name,
      area: rc.question.area,
      reason: 'Foco prioritário por incidência de erros recentes no caderno de erros',
      recommendedQuestions: 15,
    }));

    if (suggestedTopics.length === 0) {
      suggestedTopics.push(
        {
          id: 'cardio-sca',
          topicName: 'Síndrome Coronariana Aguda',
          area: 'Clínica Médica',
          reason: 'Tema de alta prevalência na matriz do ENAMED',
          recommendedQuestions: 15,
        },
        {
          id: 'cir-apendicite',
          topicName: 'Apendicite e Abdome Agudo',
          area: 'Cirurgia',
          reason: 'Fundamento cirúrgico de maior cobrança prática',
          recommendedQuestions: 10,
        },
        {
          id: 'sc-principios-sus',
          topicName: 'Princípios e Diretrizes do SUS',
          area: 'Saúde Coletiva',
          reason: 'Revisão obrigatória do eixo comunitário',
          recommendedQuestions: 10,
        },
      );
    }

    return {
      targetExamDate: targetDate.toISOString().split('T')[0],
      daysRemaining,
      weeklyHoursGoal: user?.weeklyHoursGoal || 15,
      dailySuggestedTopics: suggestedTopics,
    };
  }

  async updateStudyPlan(userId: string, dto: UpdateStudyPlanDto) {
    const targetDate = new Date(dto.targetExamDate);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        targetExamDate: targetDate,
        weeklyHoursGoal: dto.weeklyHoursGoal,
      },
    });

    return this.getStudyPlan(userId);
  }
}
