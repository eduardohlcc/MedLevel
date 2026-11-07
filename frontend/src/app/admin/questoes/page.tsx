'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Plus,
  Save,
  Shield,
  Upload,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AREAS = [
  'Clínica Médica',
  'Cirurgia',
  'Pediatria',
  'Ginecologia e Obstetrícia',
  'Saúde Coletiva',
];

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create');

  // Form states
  const [code, setCode] = useState('MED-ADM-001');
  const [area, setArea] = useState('Clínica Médica');
  const [topicName, setTopicName] = useState('Cardiologia Clínica');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [year, setYear] = useState(2025);
  const [stem, setStem] = useState('');
  const [status, setStatus] = useState('PUBLISHED');

  const [alternatives, setAlternatives] = useState([
    { letter: 'A', text: '', isCorrect: true, explanation: '' },
    { letter: 'B', text: '', isCorrect: false, explanation: '' },
    { letter: 'C', text: '', isCorrect: false, explanation: '' },
    { letter: 'D', text: '', isCorrect: false, explanation: '' },
  ]);

  const [jsonInput, setJsonInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (body: any) => api.admin.createQuestion(body),
    onSuccess: () => {
      setFeedback('Questão cadastrada com sucesso!');
      setStem('');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  const importMutation = useMutation({
    mutationFn: (questions: any[]) => api.admin.importQuestions(questions),
    onSuccess: (data) => {
      setFeedback(data.message || 'Lote de questões importado com sucesso!');
      setJsonInput('');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (err: any) => {
      setFeedback(`Erro na importação: ${err.message}`);
    },
  });

  const handleAlternativeChange = (index: number, field: string, value: any) => {
    const updated = [...alternatives];
    updated[index] = { ...updated[index], [field]: value };
    setAlternatives(updated);
  };

  const handleSetCorrect = (index: number) => {
    const updated = alternatives.map((alt, i) => ({
      ...alt,
      isCorrect: i === index,
    }));
    setAlternatives(updated);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      code,
      area,
      topicName,
      difficulty,
      year: Number(year),
      source: 'Cadastrada por Coordenação Médica',
      status,
      stem,
      alternatives,
    });
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('O JSON deve ser um array de questões.');
      }
      importMutation.mutate(parsed);
    } catch (err: any) {
      setFeedback(`JSON inválido: ${err.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-accent" />
          <span>PORTAL ADMINISTRATIVO</span>
          <span>•</span>
          <span>CURADORIA DE CONTEÚDO MÉDICO</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Gestão de Questões
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Cadastre questões avulsas ou importe lotes em massa via JSON com status de Rascunho, Revisada ou Publicada.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-border text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Cadastrar Nova Questão
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'import'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Importar Lote (JSON)
        </button>
      </div>

      {feedback && (
        <Alert variant={feedback.includes('Erro') ? 'destructive' : 'success'}>
          {feedback.includes('Erro') ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertDescription className="text-xs">{feedback}</AlertDescription>
        </Alert>
      )}

      {activeTab === 'create' ? (
        <form onSubmit={handleSubmitQuestion}>
          <Card className="border-border bg-surface">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="font-serif text-base font-semibold text-foreground">
                Dados da Questão e Vinheta Clínica
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Código</label>
                  <Input
                    required
                    className="text-xs font-mono"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Grande Área</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="h-9 w-full rounded-sm border border-border bg-surface px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Tema Específico</label>
                  <Input
                    required
                    className="text-xs"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-9 w-full rounded-sm border border-border bg-surface px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary"
                  >
                    <option value="DRAFT">Rascunho</option>
                    <option value="REVIEWED">Revisada</option>
                    <option value="PUBLISHED">Publicada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Enunciado Clínico (Caso e Pergunta)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva a história clínica do paciente, sinais vitais, exames complementares e a pergunta clínica..."
                  className="w-full rounded-sm border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                />
              </div>

              {/* 4 Alternatives Config */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-foreground">
                  Alternativas (Selecione o botão de opção para definir a correta):
                </span>

                {alternatives.map((alt, i) => (
                  <div key={alt.letter} className="rounded-sm border border-border p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAlt"
                          id={`alt-${alt.letter}`}
                          checked={alt.isCorrect}
                          onChange={() => handleSetCorrect(i)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`alt-${alt.letter}`}
                          className="font-mono text-xs font-bold text-foreground cursor-pointer"
                        >
                          Alternativa {alt.letter} {alt.isCorrect && '(GABARITO CORRETO)'}
                        </label>
                      </div>
                    </div>

                    <Input
                      required
                      placeholder={`Texto da alternativa ${alt.letter}...`}
                      className="text-xs"
                      value={alt.text}
                      onChange={(e) => handleAlternativeChange(i, 'text', e.target.value)}
                    />

                    <Input
                      required
                      placeholder={`Justificativa clínica detalhada da alternativa ${alt.letter}...`}
                      className="text-xs text-muted-foreground"
                      value={alt.explanation}
                      onChange={(e) => handleAlternativeChange(i, 'explanation', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                  className="text-xs space-x-1.5 px-6"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{createMutation.isPending ? 'Salvando...' : 'Salvar Questão'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        <form onSubmit={handleImportJson}>
          <Card className="border-border bg-surface">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="font-serif text-base font-semibold text-foreground">
                Importador de Questões em Lote (JSON)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Cole o conteúdo JSON com array de questões conforme o esquema do contrato OpenAPI
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-4">
              <textarea
                required
                rows={12}
                placeholder={`[\n  {\n    "code": "MED-IMP-001",\n    "area": "Clínica Médica",\n    "topicName": "Pneumologia",\n    "difficulty": "MEDIUM",\n    "year": 2025,\n    "source": "Banca Própria",\n    "status": "PUBLISHED",\n    "stem": "Paciente de 60 anos com dispneia...",\n    "alternatives": [\n      { "letter": "A", "text": "Opção A", "isCorrect": true, "explanation": "Razão clínica..." },\n      { "letter": "B", "text": "Opção B", "isCorrect": false, "explanation": "Razão..." },\n      { "letter": "C", "text": "Opção C", "isCorrect": false, "explanation": "Razão..." },\n      { "letter": "D", "text": "Opção D", "isCorrect": false, "explanation": "Razão..." }\n    ]\n  }\n]`}
                className="w-full font-mono rounded-sm border border-border bg-surface p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={importMutation.isPending}
                  className="text-xs space-x-1.5 px-6"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{importMutation.isPending ? 'Importando Lote...' : 'Executar Importação'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
