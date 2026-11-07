'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  HelpCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.dashboard.getStats(),
  });

  const { data: plan } = useQuery({
    queryKey: ['study-plan'],
    queryFn: () => api.studyPlan.get(),
  });

  if (statsLoading || !stats) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded-sm bg-muted" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-sm border border-border bg-surface" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-sm border border-border bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Welcome & Exam Countdown Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
            <span>PAINEL ACADÊMICO</span>
            <span>•</span>
            <span className="text-primary font-semibold">PREPARAÇÃO ENAMED 2026</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Olá, Dra. Camila
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Acompanhe seu desempenho clínico, evolução semanal e retenção de erros com repetição espaçada.
          </p>
        </div>

        {plan && (
          <div className="flex items-center space-x-3 rounded-sm border border-border bg-surface px-4 py-2.5">
            <Calendar className="h-5 w-5 text-accent shrink-0" />
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Contagem Regressiva ENAMED</div>
              <div className="font-mono text-base font-semibold text-foreground">
                {plan.daysRemaining} dias restantes
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <span className="text-xs font-medium text-muted-foreground">Taxa de Acertos Global</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-mono text-2xl font-bold text-foreground">
              {stats.overallAccuracy}%
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Calculada sobre {stats.totalAttempts} questões resolvidas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <span className="text-xs font-medium text-muted-foreground">Tempo Médio / Questão</span>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-mono text-2xl font-bold text-foreground">
              {Math.floor(stats.averageTimeSeconds / 60)}m {stats.averageTimeSeconds % 60}s
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Meta ideal ENAMED: ≤ 3min (180s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <span className="text-xs font-medium text-muted-foreground">Simulados Completos</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-mono text-2xl font-bold text-foreground">
              {stats.completedExamsCount}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Sessões oficiais finalizadas com relatório
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <span className="text-xs font-medium text-muted-foreground">Caderno de Erros (SM-2)</span>
            <CheckCircle2 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-mono text-2xl font-bold text-foreground">
              {stats.activeReviewCardsCount} questões
            </div>
            <Link
              href="/revisao"
              className="mt-1 inline-flex items-center text-[11px] font-medium text-primary hover:underline"
            >
              Revisar pendências de hoje &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid: Area Performance & Weekly Evolution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance by Core Medical Area */}
        <Card className="border-border bg-surface">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="font-serif text-base font-semibold">
              Desempenho por Grande Área Médica
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Matriz oficial de referência com as 5 especialidades essenciais do ENAMED
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-1 space-y-4">
            {stats.areaAccuracy.map((item) => (
              <div key={item.area} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{item.area}</span>
                  <span className="font-mono text-muted-foreground">
                    {item.accuracy}% ({item.attempts} questões)
                  </span>
                </div>
                <Progress
                  value={item.accuracy}
                  indicatorColor={
                    item.accuracy >= 80
                      ? 'bg-success'
                      : item.accuracy >= 70
                      ? 'bg-primary'
                      : 'bg-warning'
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Evolution Curve */}
        <Card className="border-border bg-surface">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="font-serif text-base font-semibold">
              Evolução Semanal de Acertos
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Consistência de retenção e resolução de questões ao longo das semanas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.weeklyEvolution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F4C4A" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0F4C4A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D5CB" opacity={0.5} />
                  <XAxis dataKey="week" stroke="#606662" fontSize={11} tickLine={false} />
                  <YAxis domain={[40, 100]} stroke="#606662" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D9D5CB',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    name="Taxa (%)"
                    stroke="#0F4C4A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAccuracy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses / Action Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weak Topics (Priorities) */}
        <Card className="border-border bg-surface lg:col-span-1">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <CardTitle className="font-serif text-base font-semibold text-foreground">
                Pontos de Atenção (Prioridade)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Temas com menor taxa de acerto no banco
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {stats.weakTopics.map((t, idx) => (
              <div key={idx} className="rounded-sm border border-border p-3 text-xs space-y-1">
                <div className="font-medium text-foreground">{t.name}</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{t.area}</span>
                  <span className="font-mono text-destructive font-semibold">{t.accuracy}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strong Topics */}
        <Card className="border-border bg-surface lg:col-span-1">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <CardTitle className="font-serif text-base font-semibold text-foreground">
                Domínio Consolidado
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Temas com excelente retenção de gabarito
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {stats.strongTopics.map((t, idx) => (
              <div key={idx} className="rounded-sm border border-border p-3 text-xs space-y-1">
                <div className="font-medium text-foreground">{t.name}</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{t.area}</span>
                  <span className="font-mono text-success font-semibold">{t.accuracy}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Study Triggers */}
        <Card className="border-border bg-surface-subtle lg:col-span-1 flex flex-col justify-between">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="font-serif text-base font-semibold">
              Ações Rápidas de Estudo
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Direcione suas próximas sessões de treino prático
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2.5">
            <Link href="/simulados" className="block">
              <Button variant="default" size="sm" className="w-full justify-between text-xs h-9">
                <span>Novo Simulado ENAMED (100q)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/revisao" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-between text-xs h-9">
                <span>Revisar Caderno de Erros (SM-2)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/questoes" className="block">
              <Button variant="outline" size="sm" className="w-full justify-between text-xs h-9">
                <span>Explorar Banco de Questões</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
          <div className="p-5 pt-0 text-[11px] text-muted-foreground font-mono">
            Meta semanal: {plan?.weeklyHoursGoal || 20}h programadas
          </div>
        </Card>
      </div>
    </div>
  );
}
