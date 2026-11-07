'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { formatTime } from '@/lib/utils';
import { AttemptResult } from '@/types/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuestionSolvePage() {
  const params = useParams();
  const id = params?.id as string;

  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const { data: question, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: () => api.questions.getById(id),
    enabled: !!id,
  });

  // Question Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleConfirmAnswer = async () => {
    if (!selectedAlternativeId || !question) return;

    setTimerActive(false);
    setSubmitting(true);

    try {
      const result = await api.questions.attempt(question.id, {
        alternativeId: selectedAlternativeId,
        durationSeconds: seconds,
      });
      setAttemptResult(result);
    } catch (err: any) {
      // Fallback local evaluation if backend offline
      const selected = question.alternatives.find((a) => a.id === selectedAlternativeId);
      const correct = question.alternatives.find((a) => a.isCorrect);
      const isCorrect = selected?.isCorrect || false;

      setAttemptResult({
        id: 'local-' + Date.now(),
        questionId: question.id,
        isCorrect,
        selectedAlternativeId,
        correctAlternativeId: correct?.id || '',
        explanation: selected?.explanation || 'Comentário da alternativa selecionada.',
        durationSeconds: seconds,
        inReviewDeck: !isCorrect,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAlternativeId(null);
    setAttemptResult(null);
    setSeconds(0);
    setTimerActive(true);
  };

  if (isLoading || !question) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-6 w-32 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-sm border border-border bg-surface" />
      </div>
    );
  }

  const isAnswered = !!attemptResult;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Bar with back link & discrete timer */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/questoes"
          className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao banco de questões</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setFlagged(!flagged)}
            className={`inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-sm border transition-colors ${
              flagged
                ? 'border-accent bg-accent/10 text-accent font-medium'
                : 'border-border text-muted-foreground hover:bg-surface-subtle'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>{flagged ? 'Marcada para Revisão' : 'Marcar para Revisão'}</span>
          </button>

          <div className="flex items-center space-x-1.5 rounded-sm border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Question Card Optimized for Focus (max-w-[75ch]) */}
      <div className="rounded-sm border border-border bg-surface p-6 sm:p-8">
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 text-xs">
          <span className="font-mono font-semibold text-primary">{question.code}</span>
          <span className="text-border">|</span>
          <Badge variant="default" className="text-[10px]">
            {question.area}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {question.topicName}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {question.year}
          </Badge>
          <Badge
            variant={
              question.difficulty === 'EASY'
                ? 'success'
                : question.difficulty === 'HARD'
                ? 'destructive'
                : 'warning'
            }
            className="text-[10px]"
          >
            {question.difficulty === 'EASY'
              ? 'FÁCIL'
              : question.difficulty === 'HARD'
              ? 'DIFÍCIL'
              : 'MÉDIA'}
          </Badge>
        </div>

        {/* Stem (Enunciado com coluna confortável de leitura) */}
        <div className="mt-6 max-w-[75ch]">
          <p className="font-serif text-base text-foreground leading-relaxed sm:text-lg">
            {question.stem}
          </p>
        </div>

        {/* Alternatives (4 opções) */}
        <div className="mt-8 space-y-3 max-w-[75ch]">
          {question.alternatives.map((alt) => {
            const isSelected = selectedAlternativeId === alt.id;
            const isCorrectChoice = isAnswered && alt.id === attemptResult.correctAlternativeId;
            const isWrongChoice = isAnswered && isSelected && !attemptResult.isCorrect;

            let cardStyles = 'border-border bg-surface hover:bg-surface-subtle text-foreground';
            let letterBadgeStyles = 'border border-border bg-surface-subtle text-muted-foreground';

            if (!isAnswered && isSelected) {
              cardStyles = 'border-primary bg-primary/5 text-foreground ring-1 ring-primary';
              letterBadgeStyles = 'bg-primary text-primary-foreground';
            } else if (isCorrectChoice) {
              cardStyles = 'border-success bg-success-subtle text-foreground ring-1 ring-success';
              letterBadgeStyles = 'bg-success text-success-foreground';
            } else if (isWrongChoice) {
              cardStyles = 'border-destructive bg-destructive-subtle text-foreground ring-1 ring-destructive';
              letterBadgeStyles = 'bg-destructive text-destructive-foreground';
            }

            return (
              <div key={alt.id} className="space-y-2">
                <button
                  type="button"
                  disabled={isAnswered}
                  onClick={() => setSelectedAlternativeId(alt.id)}
                  className={`flex w-full items-start space-x-3.5 rounded-sm border p-4 text-left text-sm transition-colors ${cardStyles}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs font-semibold ${letterBadgeStyles}`}
                  >
                    {alt.letter}
                  </div>
                  <div className="flex-1 leading-relaxed">{alt.text}</div>
                  {isCorrectChoice && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
                  {isWrongChoice && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                </button>

                {/* Individual alternative justification when answered */}
                {isAnswered && alt.explanation && (
                  <div className="ml-10 rounded-sm border border-border/80 bg-surface-subtle/60 p-3 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Justificativa da alternativa {alt.letter}: </strong>
                    {alt.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls & Immediate Commented Rationale */}
        <div className="mt-8 max-w-[75ch] border-t border-border pt-6">
          {!isAnswered ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Selecione uma alternativa e confirme sua resposta.
              </span>
              <Button
                variant="default"
                size="sm"
                disabled={!selectedAlternativeId || submitting}
                onClick={handleConfirmAnswer}
                className="text-xs px-6"
              >
                {submitting ? 'Avaliando...' : 'Confirmar Resposta'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant={attemptResult.isCorrect ? 'success' : 'destructive'}>
                {attemptResult.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle className="text-sm font-medium">
                  {attemptResult.isCorrect ? 'Gabarito Correto!' : 'Gabarito Incorreto'}
                </AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  Tempo de resolução: <strong>{formatTime(attemptResult.durationSeconds)}</strong>.
                  {!attemptResult.isCorrect && (
                    <span>
                      {' '}Esta questão foi registrada automaticamente no seu{' '}
                      <strong>Caderno de Erros (SM-2)</strong> para revisão programada.
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs space-x-1.5">
                  <RotateCcw className="h-3 w-3" />
                  <span>Tentar Novamente</span>
                </Button>
                <Link href="/questoes">
                  <Button variant="default" size="sm" className="text-xs">
                    Próxima Questão do Banco
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
