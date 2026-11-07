'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Calendar, Check, Clock, Lock, Mail, User } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExamDate, setTargetExamDate] = useState('2026-11-20');
  const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(20);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('É obrigatório concordar com os Termos de Uso e Política de Privacidade (LGPD).');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.auth.register({
        name,
        email,
        password,
        targetExamDate,
        weeklyHoursGoal: Number(weeklyHoursGoal),
        termsAccepted: true,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('medlevel_token', response.tokens.accessToken);
        localStorage.setItem('medlevel_user', JSON.stringify(response.user));
      }

      router.push('/painel');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-lg border-border bg-surface">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif font-bold text-lg">
            M
          </div>
          <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Cadastro de Estudante
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Configure seu cronograma personalizado para o ENAMED.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="name">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Dra. Mariana Costa"
                  className="pl-9 text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="mariana@exemplo.med.br"
                  className="pl-9 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="password">
                Senha (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="pl-9 text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="examDate">
                  Data prevista do ENAMED
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="examDate"
                    type="date"
                    required
                    className="pl-9 text-xs font-mono"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="hoursGoal">
                  Meta semanal de horas
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hoursGoal"
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

            {/* LGPD Consent Checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-sm border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug">
                Li e concordo com os{' '}
                <Link href="/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade (LGPD)
                </Link>
                , autorizando o tratamento de dados estritamente para acompanhamento pedagógico.
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button type="submit" className="w-full text-xs" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta de Estudos'}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Já possui conta cadastrada?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Acesse aqui
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
