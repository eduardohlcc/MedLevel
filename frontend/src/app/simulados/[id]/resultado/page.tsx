'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  RotateCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { formatHoursAndMinutes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ExamReportPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: report, isLoading } = useQuery({
    queryKey: ['exam-report', id],
    queryFn: () => api.exams.getReport(id),
    enabled: !!id,
  });

  if (isLoading || !report) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="h-6 w-48 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-sm border border-border bg-surface" />
      </div>
    );
  }

  const isApproved = report.scorePercentage >= 60.0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>RELATÓRIO PÓS-PROVA</span>
          <span>•</span>
          <span>SIMULADO FINALIZADO</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Resultado e Análise de Desempenho
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Confira o aproveitamento geral, desempenho por especialidade e gabarito comentado completo.
        </p>
      </div>

      {/* Top Banner Result Card */}
      <Card className="border-border bg-surface">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                APROVEITAMENTO OFICIAL
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="font-mono text-4xl sm:text-5xl font-bold text-foreground">
                  {report.scorePercentage}%
                </span>
                <span className="text-sm font-mono text-muted-foreground">
                  ({report.correctCount} de {report.totalQuestions} acertos)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isApproved
                  ? 'Desempenho compatível com os critérios de suficiência das bancas examinadoras.'
                  : 'Aproveitamento abaixo do alvo. Concentre seus estudos nas especialidades de menor retenção.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <Link href="/revisao">
                <Button variant="default" size="sm" className="w-full text-xs space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Ir para Caderno de Erros (SM-2)</span>
                </Button>
              </Link>
              <Link href="/simulados">
                <Button variant="outline" size="sm" className="w-full text-xs space-x-1.5">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Iniciar Novo Simulado</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialty Breakdown */}
      <Card className="border-border bg-surface">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="font-serif text-lg font-semibold text-foreground">
            Desempenho por Grande Área Médica
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Distribuição dos acertos pelas 5 especialidades essenciais da prova
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-1 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {report.areaBreakdown.map((item) => (
              <div key={item.area} className="rounded-sm border border-border p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{item.area}</span>
                  <span className="font-mono font-semibold">
                    {item.correct}/{item.total} ({item.percentage}%)
                  </span>
                </div>
                <Progress
                  value={item.percentage}
                  indicatorColor={
                    item.percentage >= 70
                      ? 'bg-success'
                      : item.percentage >= 50
                      ? 'bg-primary'
                      : 'bg-destructive'
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question by Question Review */}
      {report.questionsReview && report.questionsReview.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Revisão Questão a Questão
          </h2>

          <div className="space-y-4">
            {report.questionsReview.map((q) => (
              <Card key={q.questionId} className="border-border bg-surface">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-semibold text-primary">
                        Questão {q.orderIndex}
                      </span>
                      <span className="text-border">|</span>
                      <Badge variant="default" className="text-[10px]">
                        {q.area}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {q.topicName}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-1.5 font-medium">
                      {q.isCorrect ? (
                        <span className="flex items-center space-x-1 text-success text-xs font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Acertou</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-destructive text-xs font-mono">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Errou</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-sm text-foreground leading-relaxed">
                    {q.stem}
                  </p>

                  <div className="space-y-2 pt-2">
                    {q.alternatives.map((alt) => {
                      const isCorrect = alt.isCorrect;
                      const isUserSelected = q.selectedAlternativeId === alt.id;

                      let style = 'border-border bg-surface text-foreground';
                      if (isCorrect) {
                        style = 'border-success bg-success-subtle text-foreground font-medium';
                      } else if (isUserSelected && !isCorrect) {
                        style = 'border-destructive bg-destructive-subtle text-foreground';
                      }

                      return (
                        <div key={alt.id} className="space-y-1">
                          <div
                            className={`flex items-start space-x-3 rounded-sm border p-3 text-xs leading-relaxed ${style}`}
                          >
                            <span className="font-mono font-bold">{alt.letter})</span>
                            <span className="flex-1">{alt.text}</span>
                            {isCorrect && (
                              <Badge variant="success" className="text-[9px] font-mono">
                                GABARITO OFICIAL
                              </Badge>
                            )}
                            {isUserSelected && !isCorrect && (
                              <Badge variant="destructive" className="text-[9px] font-mono">
                                SUA ESCOLHA
                              </Badge>
                            )}
                          </div>
                          {alt.explanation && (
                            <p className="ml-6 text-[11px] text-muted-foreground leading-normal">
                              {alt.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
