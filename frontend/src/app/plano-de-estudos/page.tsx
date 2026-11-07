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
  Compass,
  Save,
  Sparkles,
  Target,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function StudyPlanPage() {
  const queryClient = useQueryClient();
  const [targetExamDate, setTargetExamDate] = useState('2026-11-20');
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(20);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: plan, isLoading } = useQuery({
    queryKey: ['study-plan'],
    queryFn: async () => {
      const p = await api.studyPlan.get();
      setTargetExamDate(p.targetExamDate);
      setWeeklyHoursGoal(p.weeklyHoursGoal);
      return p;
    },
  });

  const mutation = useMutation({
    mutationFn: (body: { targetExamDate: string; weeklyHoursGoal: number }) =>
      api.studyPlan.update(body),
    onSuccess: () => {
      setSavedSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['study-plan'] });
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ targetExamDate, weeklyHoursGoal: Number(weeklyHoursGoal) });
  };

  if (isLoading || !plan) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="h-6 w-48 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-sm border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>PLANEJAMENTO DE ESTUDOS</span>
          <span>•</span>
          <span>CRONOGRAMA ADAPTATIVO</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Plano de Estudos e Metas Diárias
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          O sistema distribui sua carga horária e prioriza automaticamente os temas mais vulneráveis no seu Caderno de Erros.
        </p>
      </div>

      {/* Main Grid: Parameters Form + Countdown Badge */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Configuration Card */}
        <Card className="border-border bg-surface lg:col-span-2">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="font-serif text-base font-semibold text-foreground">
              Configurações de Meta e Prova
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Ajuste sua disponibilidade semanal e a data limite do ENAMED
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <form onSubmit={handleSave} className="space-y-4">
              {savedSuccess && (
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Plano de estudos recalculado e salvo com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="date">
                    Data Oficial da Prova
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      required
                      className="pl-9 text-xs font-mono"
                      value={targetExamDate}
                      onChange={(e) => setTargetExamDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="hours">
                    Horas de Estudo Semanais
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hours"
                      type="number"
                      min={5}
                      max={80}
                      required
                      className="pl-9 text-xs font-mono"
                      value={weeklyHoursGoal}
                      onChange={(e) => setWeeklyHoursGoal(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={mutation.isPending}
                  className="text-xs space-x-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{mutation.isPending ? 'Salvando...' : 'Recalcular Cronograma'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Days Left Card */}
        <Card className="border-border bg-surface-subtle lg:col-span-1 flex flex-col justify-between p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
              <Target className="h-4 w-4 text-accent" />
              <span>TEMPO ATÉ O EXAME</span>
            </div>
            <div className="font-mono text-4xl font-bold text-foreground">
              {plan.daysRemaining} dias
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Média recomendada de <strong>{Math.round(plan.weeklyHoursGoal / 6)}h/dia</strong> de treino prático (segunda a sábado).
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Link href="/questoes">
              <Button variant="outline" size="sm" className="w-full text-xs space-x-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Praticar Questões do Dia</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Suggested Topics of the Day (Based on Mistakes) */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            Temas Sugeridos para Hoje
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Priorizados automaticamente a partir da concentração de erros no seu histórico
          </p>
        </div>

        <div className="space-y-3">
          {plan.dailySuggestedTopics.map((topic, idx) => (
            <Card key={topic.id || idx} className="border-border bg-surface">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-[10px]">
                        {topic.area}
                      </Badge>
                      <h3 className="font-serif text-base font-semibold text-foreground">
                        {topic.topicName}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{topic.reason}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-mono text-xs text-primary font-semibold">
                      Meta: {topic.recommendedQuestions} questões
                    </span>
                    <Link href={`/questoes?search=${encodeURIComponent(topic.topicName)}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs space-x-1">
                        <span>Iniciar</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
