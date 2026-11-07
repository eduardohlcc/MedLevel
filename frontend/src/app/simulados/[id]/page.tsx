'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  HelpCircle,
  Send,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ExamSessionExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { alternativeId: string | null; flaggedForReview: boolean }>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(18000); // 5h
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ['exam-session', id],
    queryFn: () => api.exams.getById(id),
    enabled: !!id,
  });

  // Sync session state once loaded
  useEffect(() => {
    if (session) {
      setAnswers(session.answers || {});
      setRemainingSeconds(session.remainingSeconds || 18000);
    }
  }, [session]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectAlternative = async (questionId: string, altId: string) => {
    const current = answers[questionId] || { alternativeId: null, flaggedForReview: false };
    const updated = { ...answers, [questionId]: { ...current, alternativeId: altId } };
    setAnswers(updated);

    try {
      await api.exams.saveAnswer(id, {
        questionId,
        alternativeId: altId,
        flaggedForReview: current.flaggedForReview,
      });
    } catch {
      // offline/mock handled
    }
  };

  const handleToggleFlag = async (questionId: string) => {
    const current = answers[questionId] || { alternativeId: null, flaggedForReview: false };
    const newFlagged = !current.flaggedForReview;
    const updated = { ...answers, [questionId]: { ...current, flaggedForReview: newFlagged } };
    setAnswers(updated);

    if (current.alternativeId) {
      try {
        await api.exams.saveAnswer(id, {
          questionId,
          alternativeId: current.alternativeId,
          flaggedForReview: newFlagged,
        });
      } catch {
        // offline/mock
      }
    }
  };

  const handleFinishExam = async () => {
    setFinishing(true);
    try {
      await api.exams.finish(id);
      router.push(`/simulados/${id}/resultado`);
    } catch {
      router.push(`/simulados/${id}/resultado`);
    } finally {
      setFinishing(false);
    }
  };

  if (isLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Carregando caderno oficial do simulado...</span>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[currentIndex];
  const currentAnswer = answers[currentQ?.id];

  const totalAnswered = Object.values(answers).filter((a) => a.alternativeId !== null).length;
  const isLast15Min = remainingSeconds <= 900;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Simulation Top Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif font-bold text-base text-foreground">
              {session.mode === 'ENAMED_OFFICIAL' ? 'Simulado Oficial ENAMED' : 'Simulado Direcionado'}
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline font-mono text-xs text-muted-foreground">
              Questão {currentIndex + 1} de {session.totalQuestions}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Regressive Timer */}
            <div
              className={`flex items-center space-x-1.5 rounded-sm border px-3 py-1 font-mono text-xs ${
                isLast15Min
                  ? 'border-destructive bg-destructive-subtle text-destructive font-bold'
                  : 'border-border bg-surface text-foreground'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => setFinishModalOpen(true)}
              className="text-xs h-8 space-x-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Finalizar Prova</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Execution Workspace (2-Column Grid: Question Area + Question Navigator) */}
      <div className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Question Solving Area (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-sm border border-border bg-surface p-6 sm:p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-primary">
                    Questão {currentIndex + 1}
                  </span>
                  <span className="text-border">|</span>
                  <Badge variant="default" className="text-[10px]">
                    {currentQ.area}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {currentQ.topicName}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFlag(currentQ.id)}
                  className={`inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                    currentAnswer?.flaggedForReview
                      ? 'border-accent bg-accent/10 text-accent font-medium'
                      : 'border-border text-muted-foreground hover:bg-surface-subtle'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    {currentAnswer?.flaggedForReview ? 'Revisar depois' : 'Marcar para revisão'}
                  </span>
                </button>
              </div>

              {/* Stem */}
              <div className="mt-6 max-w-[75ch]">
                <p className="font-serif text-base text-foreground leading-relaxed sm:text-lg">
                  {currentQ.stem}
                </p>
              </div>

              {/* 4 Alternatives */}
              <div className="mt-8 space-y-3 max-w-[75ch]">
                {currentQ.alternatives.map((alt) => {
                  const isSelected = currentAnswer?.alternativeId === alt.id;
                  return (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => handleSelectAlternative(currentQ.id, alt.id)}
                      className={`flex w-full items-start space-x-3.5 rounded-sm border p-4 text-left text-sm transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                          : 'border-border bg-surface hover:bg-surface-subtle text-foreground'
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-semibold ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-surface-subtle text-muted-foreground'
                        }`}
                      >
                        {alt.letter}
                      </div>
                      <div className="flex-1 leading-relaxed">{alt.text}</div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 max-w-[75ch] border-t border-border pt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  className="text-xs space-x-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Questão Anterior</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  disabled={currentIndex === session.questions.length - 1}
                  onClick={() => setCurrentIndex((idx) => Math.min(session.questions.length - 1, idx + 1))}
                  className="text-xs space-x-1.5"
                >
                  <span>Próxima Questão</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Navigator Grid (1 Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-sm border border-border bg-surface p-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-serif text-sm font-semibold text-foreground">
                  Caderno de Questões
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {totalAnswered}/{session.totalQuestions}
                </span>
              </div>

              {/* Legend */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pb-3 border-b border-border">
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-sm bg-primary" />
                  <span>Respondida</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-sm border border-border bg-surface" />
                  <span>Em branco</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-sm bg-accent" />
                  <span>Para revisão</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-sm border-2 border-primary bg-surface" />
                  <span>Atual</span>
                </div>
              </div>

              {/* Interactive Number Matrix (1 to 100) */}
              <div className="mt-4 grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                {session.questions.map((q, idx) => {
                  const ans = answers[q.id];
                  const hasAnswered = !!ans?.alternativeId;
                  const isFlagged = !!ans?.flaggedForReview;
                  const isCurrent = idx === currentIndex;

                  let tileColor = 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle';
                  if (isFlagged) {
                    tileColor = 'bg-accent text-accent-foreground font-semibold border-accent';
                  } else if (hasAnswered) {
                    tileColor = 'bg-primary text-primary-foreground font-semibold border-primary';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 rounded-sm border text-xs font-mono transition-all flex items-center justify-center ${tileColor} ${
                        isCurrent ? 'ring-2 ring-foreground ring-offset-1' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => setFinishModalOpen(true)}
                >
                  Entregar Simulado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Finish Modal */}
      {finishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-surface p-6 shadow-lg space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Finalizar e Entregar Simulado?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Você respondeu <strong>{totalAnswered}</strong> de <strong>{session.totalQuestions}</strong> questões.
              {session.totalQuestions - totalAnswered > 0 && (
                <span className="text-warning block mt-1">
                  Atenção: restam <strong>{session.totalQuestions - totalAnswered}</strong> questões em branco.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFinishModalOpen(false)}
                className="text-xs"
              >
                Continuar Respondendo
              </Button>
              <Button
                variant="default"
                size="sm"
                disabled={finishing}
                onClick={handleFinishExam}
                className="text-xs"
              >
                {finishing ? 'Processando gabarito...' : 'Confirmar Entrega'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
