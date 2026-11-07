'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CheckSquare,
  Clock,
  Compass,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/painel', label: 'Painel', icon: LayoutDashboard },
    { href: '/questoes', label: 'Banco de Questões', icon: BookOpen },
    { href: '/simulados', label: 'Simulados ENAMED', icon: Clock },
    { href: '/revisao', label: 'Caderno de Erros (SM-2)', icon: CheckSquare },
    { href: '/plano-de-estudos', label: 'Plano de Estudos', icon: Compass },
    { href: '/admin/questoes', label: 'Administração', icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-6">
          <Link href="/painel" className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-serif font-bold text-sm">
              M
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              MedLevel
            </span>
            <span className="hidden rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-mono font-medium text-accent sm:inline-block">
              ENAMED
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/painel' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors',
                    isActive
                      ? 'bg-surface-subtle text-primary font-semibold border-b-2 border-primary'
                      : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[1.75]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {process.env.NODE_ENV !== 'production' && (
            <Link href="/design">
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 font-mono text-muted-foreground">
                /design
              </Button>
            </Link>
          )}

          <Link href="/perfil">
            <Button variant="outline" size="sm" className="h-8 space-x-1.5 text-xs">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dra. Camila</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
