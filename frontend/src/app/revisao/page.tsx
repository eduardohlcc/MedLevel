'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { ReviewCardItem } from '@/types/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorNotebookReviewsPage() {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [grading, setGrading] = useState(false);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['reviews-today'],
    queryFn: () => api.reviews.getToday(),
  });

  const gradeMutation = useMutation({
    mutationFn: ({ cardId, grade }: { cardId: string; grade: number }) =>
      api.reviews.submitGrade(cardId, grade),
    onSuccess: () => {
      setShowAnswer(false);
      if (cards && currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ['reviews-today'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      }
    },
  });

  const handleGrade = async (grade: number) => {
    if (!cards || !cards[currentIndex]) return;
    setGrading(true);
    await gradeMutation.mutateAsync({ cardId: cards[currentIndex].id, grade });
    setGrading(false);
  };

  if (isLoading || !cards) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="h-6 w-48 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-sm border border-border bg-surface" />
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const pendingCount = cards.length - currentIndex;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>CADERNO DE ERROS</span>
          <span>•</span>
          <span>ALGORITMO DE REPETIÇÃO ESPAÇADA SM-2</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Revisão de Hoje
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Fortaleça a memória de longo prazo revisando as questões erradas nos intervalos matemáticos ideais.
        </p>
      </div>

      {cards.length === 0 || !currentCard ? (
        <Card className="border-border bg-surface p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <h2 className="mt-3 font-serif text-lg font-bold text-foreground">
            Todas as revisões de hoje foram concluídas!
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Seu Caderno de Erros está zerado para a data atual. As próximas revisões programadas pelo algoritmo SM-2 aparecerão conforme o intervalo de repetição espaçada.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-3">
            <Link href="/questoes">
              <Button variant="default" size="sm" className="text-xs">
                Resolver Novas Questões
              </Button>
            </Link>
            <Link href="/painel">
              <Button variant="outline" size="sm" className="text-xs">
                Voltar ao Painel
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground bg-surface border border-border p-3 rounded-sm">
            <span>
              Cartão <strong>{currentIndex + 1}</strong> de <strong>{cards.length}</strong>
            </span>
            <span className="text-accent font-semibold">
              {pendingCount} questão(ões) pendente(s)
            </span>
            <span>
              Intervalo atual: {currentCard.interval} dia(s) (EF: {currentCard.easeFactor})
            </span>
          </div>

          {/* Flashcard / Question Review Card */}
          <div className="rounded-sm border border-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 text-xs">
              <span className="font-mono font-semibold text-primary">{currentCard.question.code}</span>
              <span className="text-border">|</span>
              <Badge variant="default" className="text-[10px]">
                {currentCard.question.area}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {currentCard.question.topicName}
              </Badge>
              <Badge variant="warning" className="text-[10px]">
                REPETIÇÃO #{currentCard.repetitions}
              </Badge>
            </div>

            {/* Stem */}
            <div className="max-w-[75ch]">
              <p className="font-serif text-base text-foreground leading-relaxed sm:text-lg">
                {currentCard.question.stem}
              </p>
            </div>

            {/* Alternatives */}
            <div className="space-y-2.5 max-w-[75ch]">
              {currentCard.question.alternatives.map((alt) => {
                const isCorrect = alt.isCorrect;
                let borderStyle = 'border-border bg-surface text-foreground';

                if (showAnswer) {
                  borderStyle = isCorrect
                    ? 'border-success bg-success-subtle text-foreground ring-1 ring-success font-medium'
                    : 'border-border bg-surface-subtle text-muted-foreground opacity-70';
                }

                return (
                  <div
                    key={alt.id}
                    className={`flex items-start space-x-3 rounded-sm border p-3.5 text-left text-xs leading-relaxed transition-colors ${borderStyle}`}
                  >
                    <div className="font-mono font-bold">{alt.letter})</div>
                    <div className="flex-1">{alt.text}</div>
                    {showAnswer && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action to Reveal Answer or Rate Retention */}
            <div className="border-t border-border pt-6 max-w-[75ch]">
              {!showAnswer ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Tente recordar mentalmente o gabarito e a conduta recomendada.
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowAnswer(true)}
                    className="text-xs px-6"
                  >
                    Ver Gabarito e Justificativa
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Detailed Explanation */}
                  <div className="rounded-sm border border-success/30 bg-success-subtle p-4 text-xs leading-relaxed text-foreground space-y-2">
                    <div className="flex items-center space-x-1.5 font-semibold text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Comentário Oficial da Banca</span>
                    </div>
                    {currentCard.question.alternatives.map(
                      (alt) =>
                        alt.isCorrect && (
                          <p key={alt.id} className="text-muted-foreground">
                            {alt.explanation}
                          </p>
                        ),
                    )}
                  </div>

                  {/* SM-2 Recall Rating Scale (0 to 5) */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-foreground">
                      Como foi sua retenção deste conteúdo? (Algoritmo SM-2):
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button
                        type="button"
                        disabled={grading}
                        onClick={() => handleGrade(1)}
                        className="rounded-sm border border-destructive/40 bg-destructive-subtle p-2.5 text-left text-xs text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <div className="font-bold">Errei / Apagão</div>
                        <div className="text-[10px] opacity-80">Reiniciar para amanhã</div>
                      </button>

                      <button
                        type="button"
                        disabled={grading}
                        onClick={() => handleGrade(3)}
                        className="rounded-sm border border-warning/40 bg-warning-subtle p-2.5 text-left text-xs text-warning hover:bg-warning/20 transition-colors"
                      >
                        <div className="font-bold">Difícil</div>
                        <div className="text-[10px] opacity-80">Lembrei com hesitação</div>
                      </button>

                      <button
                        type="button"
                        disabled={grading}
                        onClick={() => handleGrade(4)}
                        className="rounded-sm border border-primary/40 bg-primary/10 p-2.5 text-left text-xs text-primary hover:bg-primary/20 transition-colors"
                      >
                        <div className="font-bold">Bom</div>
                        <div className="text-[10px] opacity-80">Lembrei após reflexão</div>
                      </button>

                      <button
                        type="button"
                        disabled={grading}
                        onClick={() => handleGrade(5)}
                        className="rounded-sm border border-success/40 bg-success-subtle p-2.5 text-left text-xs text-success hover:bg-success/20 transition-colors"
                      >
                        <div className="font-bold">Fácil</div>
                        <div className="text-[10px] opacity-80">Recordação instantânea</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
