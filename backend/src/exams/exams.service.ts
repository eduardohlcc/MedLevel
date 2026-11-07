import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExamMode, ExamStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaveAnswerDto, StartExamDto } from './dto/start-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async startExam(userId: string, dto: StartExamDto) {
    const isOfficial = dto.mode === ExamMode.ENAMED_OFFICIAL;
    const durationMinutes = isOfficial ? 300 : 60; // 5 hours for ENAMED official
    const requestedCount = isOfficial ? 100 : dto.customQuestionCount || 40;

    const where: any = { status: 'PUBLISHED' };
    if (!isOfficial && dto.selectedAreas && dto.selectedAreas.length > 0) {
      where.area = { in: dto.selectedAreas };
    }

    const availableQuestions = await this.prisma.question.findMany({
      where,
      select: { id: true },
    });

    if (availableQuestions.length === 0) {
      throw new BadRequestException('Não há questões disponíveis para os critérios selecionados.');
    }

    // Shuffle and pick questions
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, requestedCount);

    const session = await this.prisma.examSession.create({
      data: {
        userId,
        mode: dto.mode,
        status: ExamStatus.IN_PROGRESS,
        totalQuestions: selected.length,
        durationMinutes,
        questions: {
          create: selected.map((q, idx) => ({
            questionId: q.id,
            orderIndex: idx + 1,
          })),
        },
      },
      include: {
        questions: {
          include: {
            question: {
              include: {
                topic: true,
                alternatives: {
                  select: { id: true, letter: true, text: true },
                },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    return this.formatSessionResponse(session);
  }

  async getExamSession(userId: string, sessionId: string) {
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          include: {
            question: {
              include: {
                topic: true,
                alternatives: {
                  select: { id: true, letter: true, text: true },
                },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Sessão de simulado não encontrada.');
    }

    return this.formatSessionResponse(session);
  }

  async saveAnswer(userId: string, sessionId: string, dto: SaveAnswerDto) {
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Sessão de simulado não encontrada.');
    }

    if (session.status !== ExamStatus.IN_PROGRESS) {
      throw new BadRequestException('Este simulado já foi finalizado ou expirou.');
    }

    const examQuestion = await this.prisma.examSessionQuestion.findFirst({
      where: {
        examSessionId: sessionId,
        questionId: dto.questionId,
      },
    });

    if (!examQuestion) {
      throw new NotFoundException('Questão não pertence a este simulado.');
    }

    await this.prisma.examSessionQuestion.update({
      where: { id: examQuestion.id },
      data: {
        selectedAlternativeId: dto.alternativeId,
        flaggedForReview: dto.flaggedForReview ?? examQuestion.flaggedForReview,
      },
    });

    return { success: true };
  }

  async finishExam(userId: string, sessionId: string) {
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          include: {
            question: {
              include: { alternatives: true },
            },
          },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Sessão de simulado não encontrada.');
    }

    if (session.status === ExamStatus.FINISHED) {
      return this.getExamReport(userId, sessionId);
    }

    let correctCount = 0;

    for (const item of session.questions) {
      const correctAlt = item.question.alternatives.find((alt) => alt.isCorrect);
      const isCorrect = item.selectedAlternativeId === correctAlt?.id;

      if (isCorrect) {
        correctCount += 1;
      }

      await this.prisma.examSessionQuestion.update({
        where: { id: item.id },
        data: { isCorrect },
      });

      // Record attempt and spaced repetition if wrong
      if (item.selectedAlternativeId) {
        await this.prisma.attempt.create({
          data: {
            userId,
            questionId: item.questionId,
            selectedAlternativeId: item.selectedAlternativeId,
            isCorrect,
            durationSeconds: 120, // estimated
          },
        });

        if (!isCorrect) {
          // add or reset in SM-2
          const existingCard = await this.prisma.reviewCard.findUnique({
            where: {
              userId_questionId: {
                userId,
                questionId: item.questionId,
              },
            },
          });

          if (!existingCard) {
            await this.prisma.reviewCard.create({
              data: {
                userId,
                questionId: item.questionId,
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                dueDate: new Date(),
              },
            });
          }
        }
      }
    }

    const scorePercentage =
      session.questions.length > 0
        ? Number(((correctCount / session.questions.length) * 100).toFixed(1))
        : 0;

    await this.prisma.examSession.update({
      where: { id: sessionId },
      data: {
        status: ExamStatus.FINISHED,
        finishedAt: new Date(),
        correctCount,
        scorePercentage,
      },
    });

    return this.getExamReport(userId, sessionId);
  }

  async getExamReport(userId: string, sessionId: string) {
    const session = await this.prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          include: {
            question: {
              include: {
                topic: true,
                alternatives: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Relatório não encontrado.');
    }

    // Breakdown by broad medical area
    const areaMap: Record<string, { total: number; correct: number }> = {};

    session.questions.forEach((q) => {
      const area = q.question.area;
      if (!areaMap[area]) {
        areaMap[area] = { total: 0, correct: 0 };
      }
      areaMap[area].total += 1;
      if (q.isCorrect) {
        areaMap[area].correct += 1;
      }
    });

    const areaBreakdown = Object.entries(areaMap).map(([area, stats]) => ({
      area,
      total: stats.total,
      correct: stats.correct,
      percentage: Number(((stats.correct / stats.total) * 100).toFixed(1)),
    }));

    const totalSeconds = session.finishedAt
      ? Math.round((session.finishedAt.getTime() - session.startedAt.getTime()) / 1000)
      : session.durationMinutes * 60;

    return {
      id: session.id,
      mode: session.mode,
      status: session.status,
      totalQuestions: session.totalQuestions,
      correctCount: session.correctCount || 0,
      scorePercentage: session.scorePercentage || 0,
      totalDurationSeconds: totalSeconds,
      areaBreakdown,
      questionsReview: session.questions.map((q) => ({
        orderIndex: q.orderIndex,
        questionId: q.questionId,
        stem: q.question.stem,
        code: q.question.code,
        area: q.question.area,
        topicName: q.question.topic.name,
        selectedAlternativeId: q.selectedAlternativeId,
        isCorrect: q.isCorrect,
        alternatives: q.question.alternatives.map((alt) => ({
          id: alt.id,
          letter: alt.letter,
          text: alt.text,
          isCorrect: alt.isCorrect,
          explanation: alt.explanation,
        })),
      })),
    };
  }

  private formatSessionResponse(session: any) {
    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(session.startedAt).getTime()) / 1000,
    );
    const totalAllowedSeconds = session.durationMinutes * 60;
    const remainingSeconds = Math.max(0, totalAllowedSeconds - elapsedSeconds);

    const answers: Record<string, { alternativeId: string | null; flaggedForReview: boolean }> =
      {};

    session.questions.forEach((q: any) => {
      answers[q.questionId] = {
        alternativeId: q.selectedAlternativeId,
        flaggedForReview: q.flaggedForReview,
      };
    });

    return {
      id: session.id,
      mode: session.mode,
      status: session.status,
      totalQuestions: session.totalQuestions,
      durationMinutes: session.durationMinutes,
      startedAt: session.startedAt,
      remainingSeconds,
      questions: session.questions.map((q: any) => ({
        id: q.question.id,
        orderIndex: q.orderIndex,
        code: q.question.code,
        area: q.question.area,
        topicName: q.question.topic.name,
        stem: q.question.stem,
        alternatives: q.question.alternatives,
      })),
      answers,
    };
  }
}
