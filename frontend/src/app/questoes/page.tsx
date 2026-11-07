'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  Filter,
  Layers,
  Search,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AREAS = [
  'Todas as Áreas',
  'Clínica Médica',
  'Cirurgia',
  'Pediatria',
  'Ginecologia e Obstetrícia',
  'Saúde Coletiva',
];

const DIFFICULTIES = [
  { label: 'Todas as Dificuldades', value: 'all' },
  { label: 'Fácil', value: 'EASY' },
  { label: 'Média', value: 'MEDIUM' },
  { label: 'Difícil', value: 'HARD' },
];

export default function QuestionsBankPage() {
  const [selectedArea, setSelectedArea] = useState('Todas as Áreas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filterAreaParam = selectedArea === 'Todas as Áreas' ? undefined : selectedArea;
  const filterDifficultyParam = selectedDifficulty === 'all' ? undefined : selectedDifficulty;

  const { data, isLoading } = useQuery({
    queryKey: ['questions', filterAreaParam, filterDifficultyParam, search, page],
    queryFn: () =>
      api.questions.list({
        area: filterAreaParam,
        difficulty: filterDifficultyParam,
        search: search.trim() || undefined,
        page,
      }),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>BANCO DE QUESTÕES</span>
          <span>•</span>
          <span>MATRIZ OFICIAL ENAMED</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Questões e Casos Clínicos
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Filtre por especialidade, nível de complexidade e temas de interesse para treino focado.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-sm border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por termo clínico, sinal semiológico ou código..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Area Selector */}
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-sm border border-border bg-surface px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Difficulty Selector */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-sm border border-border bg-surface px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-sm border border-border bg-surface" />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((q) => (
            <Card
              key={q.id}
              className="border-border bg-surface transition-all hover:border-primary/50"
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-primary">{q.code}</span>
                      <span className="text-border">|</span>
                      <Badge variant="default" className="text-[10px]">
                        {q.area}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {q.topicName}
                      </Badge>
                      <Badge
                        variant={
                          q.difficulty === 'EASY'
                            ? 'success'
                            : q.difficulty === 'HARD'
                            ? 'destructive'
                            : 'warning'
                        }
                        className="text-[10px]"
                      >
                        {q.difficulty === 'EASY'
                          ? 'FÁCIL'
                          : q.difficulty === 'HARD'
                          ? 'DIFÍCIL'
                          : 'MÉDIA'}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">{q.year}</span>
                    </div>

                    <p className="font-serif text-sm text-foreground line-clamp-3 leading-relaxed">
                      {q.stem}
                    </p>
                  </div>

                  <div className="shrink-0 pt-1">
                    <Link href={`/questoes/${q.id}`}>
                      <Button variant="default" size="sm" className="h-8 space-x-1.5 text-xs">
                        <span>Resolver</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-sm border border-border bg-surface p-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 font-serif text-base font-semibold text-foreground">
              Nenhuma questão encontrada
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Tente alterar os filtros ou o termo de busca pesquisado.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-muted-foreground font-mono">
            Página {data.page} de {data.totalPages} ({data.total} questões no total)
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs h-8"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs h-8"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
