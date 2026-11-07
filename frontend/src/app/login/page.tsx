'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('estudante@medlevel.com.br');
  const [password, setPassword] = useState('Senha123#');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('medlevel_token', response.tokens.accessToken);
        localStorage.setItem('medlevel_user', JSON.stringify(response.user));
      }
      router.push('/painel');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-md border-border bg-surface">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif font-bold text-lg">
            M
          </div>
          <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Acesso ao MedLevel
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Ambiente de estudos e simulados para concluintes do curso de Medicina.
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
              <label className="text-xs font-medium text-foreground" htmlFor="email">
                E-mail institucional ou pessoal
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="estudante@exemplo.med.br"
                  className="pl-9 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground" htmlFor="password">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-9 text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button type="submit" className="w-full text-xs" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Não possui uma conta?{' '}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
