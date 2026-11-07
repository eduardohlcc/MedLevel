'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ALL_AREAS = [
  'Clínica Médica',
  'Cirurgia',
  'Pediatria',
  'Ginecologia e Obstetrícia',
  'Saúde Coletiva',
];

export default function SimuladosHubPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customCount, setCustomCount] = useState(25);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(ALL_AREAS);

  const handleStartOfficial = async () => {
    setLoading(true);
    try {
      const session = await api.exams.start({
        mode: 'ENAMED_OFFICIAL',
        customQuestionCount: 100,
      });
      router.push(`/simulados/${session.id}`);
    } catch {
      router.push('/simulados/exam-sess-001');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCustom = async () => {
    setLoading(true);
    try {
      const session = await api.exams.start({
        mode: 'CUSTOM',
        customQuestionCount: customCount,
        selectedAreas,
      });
      router.push(`/simulados/${session.id}`);
    } catch {
      router.push('/simulados/exam-sess-001');
    } finally {
      setLoading(false);
    }
  };

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter((a) => a !== area));
      }
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>SIMULADOS DE PROVA</span>
          <span>•</span>
          <span>CONDIÇÕES REAIS DE EXAME</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Simulados ENAMED
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Treine o gerenciamento de tempo, resistência física e raciocínio clínico sob pressão temporal.
        </p>
      </div>

      {/* 2 Main Options Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Official ENAMED Simulation Card */}
        <Card className="border-border bg-surface flex flex-col justify-between">
          <div>
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-xs font-mono">
                  MODO OFICIAL
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">PADRÃO INEP</span>
              </div>
              <CardTitle className="mt-3 font-serif text-xl font-bold text-foreground">
                Simulado Oficial ENAMED
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                Reproduz exatamente a estrutura oficial do exame: 100 questões objetivas com 4 alternativas, cronômetro contínuo de 5 horas e distribuição balanceada entre as 5 grandes áreas da medicina.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-3">
              <div className="rounded-sm border border-border bg-surface-subtle p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total de Questões:</span>
                  <span className="font-mono font-semibold text-foreground">100 questões objetivas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duração Máxima:</span>
                  <span className="font-mono font-semibold text-foreground">5 horas (300 minutos)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ritmo Recomendado:</span>
                  <span className="font-mono text-primary font-semibold">3 minutos / questão</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gabarito e Relatório:</span>
                  <span className="font-mono font-semibold text-foreground">Disponível após o envio</span>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="p-6 pt-0">
            <Button
              variant="default"
              size="lg"
              className="w-full text-xs space-x-2"
              disabled={loading}
              onClick={handleStartOfficial}
            >
              <span>{loading ? 'Preparando caderno de prova...' : 'Iniciar Simulado Oficial (100q / 5h)'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Custom Exam Card */}
        <Card className="border-border bg-surface flex flex-col justify-between">
          <div>
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-mono">
                  MODO PERSONALIZADO
                </Badge>
                <Sliders className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="mt-3 font-serif text-xl font-bold text-foreground">
                Simulado Direcionado
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                Monte uma sessão de treino rápida escolhendo a quantidade de questões e as áreas específicas em que você mais precisa praticar.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-4">
              {/* Question Count Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Quantidade de Questões: <span className="font-mono text-primary font-bold">{customCount}</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[10, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomCount(num)}
                      className={`flex-1 rounded-sm border py-1.5 text-xs font-mono transition-colors ${
                        customCount === num
                          ? 'border-primary bg-primary text-primary-foreground font-semibold'
                          : 'border-border bg-surface hover:bg-surface-subtle text-foreground'
                      }`}
                    >
                      {num}q
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Grandes Áreas Selecionadas:
                </label>
                <div className="space-y-1.5">
                  {ALL_AREAS.map((area) => {
                    const isChecked = selectedAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 text-left text-xs transition-colors ${
                          isChecked
                            ? 'border-primary/50 bg-primary/5 text-foreground'
                            : 'border-border bg-surface text-muted-foreground opacity-60'
                        }`}
                      >
                        <span>{area}</span>
                        {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="p-6 pt-0">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-xs space-x-2"
              disabled={loading}
              onClick={handleStartCustom}
            >
              <span>{loading ? 'Montando prova...' : `Iniciar Simulado Customizado (${customCount}q)`}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
