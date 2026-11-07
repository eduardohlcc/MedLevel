import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async createAttempt(userId: string, questionId: string, dto: CreateAttemptDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        alternatives: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Questão não encontrada.');
    }

    const selectedAlt = question.alternatives.find((alt) => alt.id === dto.alternativeId);
    if (!selectedAlt) {
      throw new NotFoundException('Alternativa selecionada inválida para esta questão.');
    }

    const correctAlt = question.alternatives.find((alt) => alt.isCorrect);
    const isCorrect = selectedAlt.isCorrect;

    const attempt = await this.prisma.attempt.create({
      data: {
        userId,
        questionId,
        selectedAlternativeId: dto.alternativeId,
        isCorrect,
        durationSeconds: dto.durationSeconds,
      },
    });

    let inReviewDeck = false;

    // If incorrect, automatically register in SM-2 Spaced Repetition deck
    if (!isCorrect) {
      inReviewDeck = true;
      const existingCard = await this.prisma.reviewCard.findUnique({
        where: {
          userId_questionId: {
            userId,
            questionId,
          },
        },
      });

      if (!existingCard) {
        await this.prisma.reviewCard.create({
          data: {
            userId,
            questionId,
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            dueDate: new Date(), // due immediately for today's review
          },
        });
      } else {
        // Reset repetitions on lapse
        await this.prisma.reviewCard.update({
          where: { id: existingCard.id },
          data: {
            repetitions: 0,
            interval: 1,
            dueDate: new Date(),
          },
        });
      }
    }

    return {
      id: attempt.id,
      questionId: question.id,
      isCorrect,
      selectedAlternativeId: selectedAlt.id,
      correctAlternativeId: correctAlt?.id,
      explanation: selectedAlt.explanation,
      durationSeconds: dto.durationSeconds,
      inReviewDeck,
      alternativesFeedback: question.alternatives.map((alt) => ({
        id: alt.id,
        letter: alt.letter,
        isCorrect: alt.isCorrect,
        explanation: alt.explanation,
      })),
    };
  }

  async getUserAttempts(userId: string) {
    return this.prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        question: {
          select: {
            id: true,
            code: true,
            area: true,
          },
        },
      },
    });
  }
}
