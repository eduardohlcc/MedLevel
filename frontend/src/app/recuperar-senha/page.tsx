'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.auth.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-md border-border bg-surface">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Recuperação de Acesso
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Informe seu e-mail para receber as instruções de redefinição de senha.
          </CardDescription>
        </CardHeader>

        {submitted ? (
          <CardContent className="space-y-4 pt-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Se houver uma conta cadastrada com o endereço <strong>{email}</strong>, enviamos um link para redefinição. (Ambiente de demonstração: envio simulado).
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full text-xs space-x-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Retornar ao Login</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="email">
                  E-mail cadastrado
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
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full text-xs" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
              </Button>

              <div className="text-center text-xs">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Voltar para o login</span>
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
