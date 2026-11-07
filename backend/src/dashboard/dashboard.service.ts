import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const [attempts, completedExamsCount, activeReviewCardsCount] = await Promise.all([
      this.prisma.attempt.findMany({
        where: { userId },
        include: {
          question: {
            include: { topic: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.examSession.count({
        where: { userId, status: 'FINISHED' },
      }),
      this.prisma.reviewCard.count({
        where: { userId },
      }),
    ]);

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const overallAccuracy =
      totalAttempts > 0 ? Number(((correctAttempts / totalAttempts) * 100).toFixed(1)) : 0;

    const totalDuration = attempts.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    const averageTimeSeconds =
      totalAttempts > 0 ? Math.round(totalDuration / totalAttempts) : 0;

    // By area
    const areaMap: Record<string, { total: number; correct: number }> = {
      'Clínica Médica': { total: 0, correct: 0 },
      'Cirurgia': { total: 0, correct: 0 },
      'Pediatria': { total: 0, correct: 0 },
      'Ginecologia e Obstetrícia': { total: 0, correct: 0 },
      'Saúde Coletiva': { total: 0, correct: 0 },
    };

    // By topic
    const topicMap: Record<string, { name: string; area: string; total: number; correct: number }> =
      {};

    attempts.forEach((a) => {
      const area = a.question.area;
      if (!areaMap[area]) {
        areaMap[area] = { total: 0, correct: 0 };
      }
      areaMap[area].total += 1;
      if (a.isCorrect) {
        areaMap[area].correct += 1;
      }

      const topicId = a.question.topicId;
      if (!topicMap[topicId]) {
        topicMap[topicId] = {
          name: a.question.topic.name,
          area: a.question.area,
          total: 0,
          correct: 0,
        };
      }
      topicMap[topicId].total += 1;
      if (a.isCorrect) {
        topicMap[topicId].correct += 1;
      }
    });

    const areaAccuracy = Object.entries(areaMap).map(([area, stats]) => ({
      area,
      accuracy:
        stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0,
      attempts: stats.total,
    }));

    // Identify weak and strong topics
    const topicStats = Object.values(topicMap)
      .filter((t) => t.total >= 1)
      .map((t) => ({
        name: t.name,
        area: t.area,
        accuracy: Number(((t.correct / t.total) * 100).toFixed(1)),
        total: t.total,
      }));

    const weakTopics = [...topicStats]
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    const strongTopics = [...topicStats]
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);

    // Mock/derived weekly evolution
    const weeklyEvolution = [
      { week: 'Semana 1', accuracy: 58.0, questionsDone: 35 },
      { week: 'Semana 2', accuracy: 64.5, questionsDone: 42 },
      { week: 'Semana 3', accuracy: 71.0, questionsDone: 50 },
      { week: 'Semana 4 (atual)', accuracy: overallAccuracy || 74.0, questionsDone: totalAttempts || 60 },
    ];

    return {
      totalAttempts,
      overallAccuracy,
      averageTimeSeconds: averageTimeSeconds || 115,
      completedExamsCount,
      activeReviewCardsCount,
      areaAccuracy,
      weeklyEvolution,
      weakTopics: weakTopics.length > 0 ? weakTopics : [
        { name: 'Síndromes Hipertensivas da Gestação', area: 'Ginecologia e Obstetrícia', accuracy: 40.0 },
        { name: 'Injúria Renal Aguda', area: 'Clínica Médica', accuracy: 50.0 },
      ],
      strongTopics: strongTopics.length > 0 ? strongTopics : [
        { name: 'Princípios e Diretrizes do SUS', area: 'Saúde Coletiva', accuracy: 88.0 },
        { name: 'Apendicite Aguda', area: 'Cirurgia', accuracy: 82.0 },
      ],
    };
  }
}
