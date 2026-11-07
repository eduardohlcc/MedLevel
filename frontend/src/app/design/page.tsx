'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function DesignSystemGalleryPage() {
  const [selectedAlt, setSelectedAlt] = useState<'A' | 'B' | 'C' | 'D' | null>('B');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>MEDLEVEL</span>
          <span>/</span>
          <span>SISTEMA DE DESIGN</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Galeria de Componentes e Design Tokens
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Identidade visual editorial, sóbria e focada na experiência do estudante de medicina. 
          Todos os componentes seguem as especificações de acessibilidade WCAG AA, grid de múltiplos de 4px e ausência de efeitos gráficos poluentes.
        </p>
      </div>

      {/* 1. Design Tokens: Cores */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-foreground">1. Paleta de Cores e Tokens Semânticos</h2>
        <p className="text-xs text-muted-foreground mt-1">Valores contidos de alto contraste sem gradientes ou saturação excessiva.</p>
        
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <div className="rounded-sm border border-border p-3 bg-background">
            <div className="h-10 w-full rounded-sm border border-border bg-[#F6F4EF]" />
            <div className="mt-2 text-xs font-semibold">Background</div>
            <div className="font-mono text-[11px] text-muted-foreground">#F6F4EF</div>
          </div>
          <div className="rounded-sm border border-border p-3 bg-surface">
            <div className="h-10 w-full rounded-sm bg-primary text-primary-foreground flex items-center justify-center text-xs font-mono">
              #0F4C4A
            </div>
            <div className="mt-2 text-xs font-semibold">Petróleo Primário</div>
            <div className="font-mono text-[11px] text-muted-foreground">var(--primary)</div>
          </div>
          <div className="rounded-sm border border-border p-3 bg-surface">
            <div className="h-10 w-full rounded-sm bg-accent text-accent-foreground flex items-center justify-center text-xs font-mono">
              #B4691F
            </div>
            <div className="mt-2 text-xs font-semibold">Âmbar Acento</div>
            <div className="font-mono text-[11px] text-muted-foreground">var(--accent)</div>
          </div>
          <div className="rounded-sm border border-border p-3 bg-surface">
            <div className="h-10 w-full rounded-sm bg-success text-success-foreground flex items-center justify-center text-xs font-mono">
              #2F7D4F
            </div>
            <div className="mt-2 text-xs font-semibold">Acerto / Sucesso</div>
            <div className="font-mono text-[11px] text-muted-foreground">var(--success)</div>
          </div>
          <div className="rounded-sm border border-border p-3 bg-surface">
            <div className="h-10 w-full rounded-sm bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-mono">
              #B23A3A
            </div>
            <div className="mt-2 text-xs font-semibold">Erro / Destrutivo</div>
            <div className="font-mono text-[11px] text-muted-foreground">var(--destructive)</div>
          </div>
          <div className="rounded-sm border border-border p-3 bg-surface">
            <div className="h-10 w-full rounded-sm bg-surface-subtle border border-border flex items-center justify-center text-xs font-mono text-foreground">
              #D9D5CB
            </div>
            <div className="mt-2 text-xs font-semibold">Bordas Sutis</div>
            <div className="font-mono text-[11px] text-muted-foreground">var(--border)</div>
          </div>
        </div>
      </section>

      {/* 2. Tipografia */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">2. Escala Tipográfica</h2>
        
        <div className="mt-4 space-y-4 rounded-sm border border-border bg-surface p-6">
          <div>
            <span className="font-mono text-xs text-muted-foreground">Source Serif 4 - Títulos e Enunciados Clínicos</span>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Homem de 58 anos apresenta dor retroesternal em aperto e supra de ST.
            </h3>
          </div>
          <div className="border-t border-border pt-3">
            <span className="font-mono text-xs text-muted-foreground">IBM Plex Sans - Textos de Interface e Explicações</span>
            <p className="text-sm text-foreground leading-relaxed">
              O diagnóstico de infarto agudo do miocárdio com supradesnivelamento do segmento ST é estritamente clínico e eletrocardiográfico, exigindo intervenção de reperfusão precoce dentro dos tempos-meta estabelecidos.
            </p>
          </div>
          <div className="border-t border-border pt-3">
            <span className="font-mono text-xs text-muted-foreground">IBM Plex Mono - Cronômetros, Estatísticas e Métricas Quantitativas</span>
            <div className="flex items-center space-x-4 font-mono text-lg font-medium text-primary">
              <span>04:48:32</span>
              <span className="text-muted-foreground">|</span>
              <span>85.4% ACERTOS</span>
              <span className="text-muted-foreground">|</span>
              <span>EF: 2.50</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Botões e Ações */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">3. Botões (Variantes e Tamanhos)</h2>
        
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="default">Confirmar Resposta</Button>
          <Button variant="secondary">Próxima Questão</Button>
          <Button variant="outline">Marcar para Revisão</Button>
          <Button variant="accent">Iniciar Simulado</Button>
          <Button variant="destructive">Abandonar Prova</Button>
          <Button variant="ghost">Voltar</Button>
          <Button variant="default" size="sm">Pequeno</Button>
          <Button variant="default" size="lg">Grande (CTA)</Button>
          <Button variant="default" disabled>Desabilitado</Button>
        </div>
      </section>

      {/* 4. Badges e Tags de Classificação Médica */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">4. Badges de Domínio e Status</h2>
        
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="default">CLÍNICA MÉDICA</Badge>
          <Badge variant="secondary">CIRURGIA</Badge>
          <Badge variant="outline">PEDIATRIA</Badge>
          <Badge variant="warning">GINECOLOGIA E OBSTETRÍCIA</Badge>
          <Badge variant="default">SAÚDE COLETIVA</Badge>
          <Badge variant="success">ACERTOU</Badge>
          <Badge variant="destructive">ERROU (SM-2)</Badge>
          <Badge variant="warning">REVISÃO HOJE</Badge>
          <Badge variant="outline">DIFICULDADE: MÉDIA</Badge>
        </div>
      </section>

      {/* 5. Alertas Semânticos */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">5. Mensagens e Alertas de Feedback</h2>
        
        <div className="mt-4 space-y-3 max-w-3xl">
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Resposta Correta!</AlertTitle>
            <AlertDescription>
              Excelente raciocínio. A fibrinólise imediata é recomendada pela SBC quando a angioplastia primária não puder ser realizada em até 120 minutos.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Resposta Incorreta</AlertTitle>
            <AlertDescription>
              Esta questão foi adicionada automaticamente ao seu <strong>Caderno de Erros</strong> para repetição espaçada pelo algoritmo SM-2.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção ao Cronômetro</AlertTitle>
            <AlertDescription>
              Restam 15 minutos para a conclusão do simulado oficial ENAMED. Responda as questões pendentes.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* 6. Modelo de Questão Clínica com 4 Alternativas */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-xl font-semibold text-foreground">6. Componente de Resolução de Questão</h2>
        <p className="text-xs text-muted-foreground mt-1">Largura máxima de leitura confortável (75ch) para evitar fadiga visual.</p>

        <div className="mt-4 max-w-3xl rounded-sm border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-primary">MED-CLM-001</span>
              <span className="text-border">|</span>
              <Badge variant="secondary">Clínica Médica</Badge>
              <Badge variant="outline">2025</Badge>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-mono text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>01:14</span>
            </div>
          </div>

          <p className="mt-4 font-serif text-base text-foreground leading-relaxed">
            Um homem de 58 anos, hipertenso e tabagista, chega à Unidade de Pronto Atendimento com dor retroesternal em aperto iniciada há 2 horas, irradiada para o membro superior esquerdo e mandíbula, acompanhada de sudorese fria. O eletrocardiograma de 12 derivações revela supradesnivelamento do segmento ST de 2,5 mm em DII, DIII e aVF. O tempo estimado de transferência para hospital terciário com angioplastia primária é de 180 minutos. Qual é a conduta farmacológica prioritária imediata recomendada?
          </p>

          {/* Alternatives Selection */}
          <div className="mt-6 space-y-2.5">
            {[
              { letter: 'A', text: 'Administrar terapia trombolítica com fibrinolítico intravenoso (ex.: tenecteplase) associada a dupla antiagregação plaquetária.', correct: true },
              { letter: 'B', text: 'Aguardar o resultado da primeira dosagem sérica de troponina ultrassensível antes de qualquer intervenção de reperfusão.', correct: false },
              { letter: 'C', text: 'Iniciar heparinização plena isolada e prescrever betabloqueador intravenoso em altas doses.', correct: false },
              { letter: 'D', text: 'Indicar transferência imediata para angioplastia primária, independentemente do tempo de deslocamento previsto.', correct: false },
            ].map((alt) => {
              const isSelected = selectedAlt === alt.letter;
              return (
                <button
                  key={alt.letter}
                  type="button"
                  onClick={() => setSelectedAlt(alt.letter as any)}
                  className={`flex w-full items-start space-x-3 rounded-sm border p-3.5 text-left text-sm transition-colors ${
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
                  <span className="leading-relaxed">{alt.text}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <Button variant="outline" size="sm">
              Marcar para Revisão
            </Button>
            <Button variant="default" size="sm">
              Confirmar Resposta
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
