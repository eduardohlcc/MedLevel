import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitGradeDto } from './dto/submit-grade.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getTodayReviews(userId: string) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const cards = await this.prisma.reviewCard.findMany({
      where: {
        userId,
        dueDate: {
          lte: endOfToday,
        },
      },
      include: {
        question: {
          include: {
            alternatives: {
              orderBy: { letter: 'asc' },
            },
            topic: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return cards.map((card) => ({
      id: card.id,
      questionId: card.questionId,
      repetitions: card.repetitions,
      interval: card.interval,
      easeFactor: card.easeFactor,
      dueDate: card.dueDate,
      question: {
        id: card.question.id,
        code: card.question.code,
        stem: card.question.stem,
        area: card.question.area,
        topicName: card.question.topic.name,
        difficulty: card.question.difficulty,
        year: card.question.year,
        source: card.question.source,
        alternatives: card.question.alternatives.map((alt) => ({
          id: alt.id,
          letter: alt.letter,
          text: alt.text,
          isCorrect: alt.isCorrect,
          explanation: alt.explanation,
        })),
      },
    }));
  }

  async submitGrade(userId: string, cardId: string, dto: SubmitGradeDto) {
    const card = await this.prisma.reviewCard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== userId) {
      throw new NotFoundException('Cartão de revisão não encontrado para o usuário.');
    }

    const { easeFactor, interval, repetitions, dueDate } = this.calculateSM2(
      card.easeFactor,
      card.interval,
      card.repetitions,
      dto.grade,
    );

    const updated = await this.prisma.reviewCard.update({
      where: { id: cardId },
      data: {
        easeFactor,
        interval,
        repetitions,
        dueDate,
        lastReviewedAt: new Date(),
      },
    });

    return {
      id: updated.id,
      questionId: updated.questionId,
      easeFactor: updated.easeFactor,
      interval: updated.interval,
      repetitions: updated.repetitions,
      dueDate: updated.dueDate,
    };
  }

  /**
   * SuperMemo 2 (SM-2) Core Mathematical Algorithm
   * @param currentEF Current Ease Factor (starts at 2.5)
   * @param currentInterval Days until next repetition
   * @param currentRepetitions Successful streak count
   * @param grade Quality of recall from 0 to 5
   */
  calculateSM2(
    currentEF: number,
    currentInterval: number,
    currentRepetitions: number,
    grade: number,
  ) {
    let easeFactor =
      currentEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    let repetitions = currentRepetitions;
    let interval = currentInterval;

    if (grade >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      // Recall failed: reset repetition streak
      repetitions = 0;
      interval = 1;
    }

    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + interval);
    nextDueDate.setHours(4, 0, 0, 0); // Scheduled for 4am on due date

    return {
      easeFactor: Number(easeFactor.toFixed(2)),
      interval,
      repetitions,
      dueDate: nextDueDate,
    };
  }
}
