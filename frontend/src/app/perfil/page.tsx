'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Calendar,
  Clock,
  LogOut,
  Mail,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import { api } from '@/lib/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      try {
        return await api.auth.me();
      } catch {
        return {
          id: 'usr-demo-01',
          name: 'Dra. Camila Rocha da Silva',
          email: 'estudante@medlevel.com.br',
          role: 'STUDENT',
          targetExamDate: '2026-11-20',
          weeklyHoursGoal: 20,
        };
      }
    },
  });

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medlevel_token');
      localStorage.removeItem('medlevel_user');
    }
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.auth.deleteAccount();
    } catch {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      setDeleting(false);
      router.push('/login');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-6 w-32 animate-pulse rounded-sm bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-sm border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
          <span>CONTA E CONFIGURAÇÕES</span>
          <span>•</span>
          <span>PRIVACIDADE E LGPD</span>
        </div>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Perfil do Estudante
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Gerencie suas preferências de estudo, dados da conta e direitos de privacidade.
        </p>
      </div>

      {/* Account Info Card */}
      <Card className="border-border bg-surface">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-base font-semibold text-foreground">
              Dados Cadastrais
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'ESTUDANTE'}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Informações associadas à sua conta na plataforma
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Nome:</span>
              <div className="font-semibold text-foreground text-sm">{user.name}</div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground">E-mail:</span>
              <div className="font-mono text-foreground text-xs">{user.email}</div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground">Data Alvo do Exame:</span>
              <div className="font-mono text-foreground text-xs">
                {user.targetExamDate
                  ? new Date(user.targetExamDate).toLocaleDateString('pt-BR')
                  : 'Não informada'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground">Meta Semanal:</span>
              <div className="font-mono text-foreground text-xs">
                {user.weeklyHoursGoal || 15} horas semanais
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 border-t border-border mt-4 flex items-center justify-between">
          <Link href="/plano-de-estudos">
            <Button variant="outline" size="sm" className="text-xs">
              Ajustar Metas de Estudo
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs space-x-1.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair da Conta</span>
          </Button>
        </CardFooter>
      </Card>

      {/* LGPD & Account Management Card */}
      <Card className="border-border bg-surface">
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center space-x-2 text-accent">
            <Shield className="h-4 w-4" />
            <CardTitle className="font-serif text-base font-semibold text-foreground">
              Privacidade e Proteção de Dados (LGPD)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Exercício dos seus direitos fundamentais como titular dos dados (Lei nº 13.709/2018)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            O MedLevel processa seus dados e respostas estritamente para propósitos de avaliação pedagógica e repetição espaçada. Seus dados nunca são comercializados com terceiros.
          </p>

          <div className="rounded-sm border border-destructive/30 bg-destructive-subtle p-4 space-y-3">
            <div className="flex items-center space-x-2 text-destructive font-semibold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Zona de Exclusão Definitiva de Dados</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Você pode excluir permanentemente seu cadastro e todo o histórico de simulados e repetição espaçada a qualquer instante. Esta ação é irreversível.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="text-xs space-x-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Excluir Minha Conta Permanentemente</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-surface p-6 shadow-lg space-y-4">
            <h3 className="font-serif text-lg font-bold text-destructive">
              Confirmar Exclusão de Conta?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Todos os seus registros de tentativas, simulados, estatísticas do painel e cadernos de erro serão apagados permanentemente dos nossos servidores em cumprimento à LGPD.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="text-xs"
              >
                {deleting ? 'Excluindo...' : 'Sim, Excluir Definitivamente'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
