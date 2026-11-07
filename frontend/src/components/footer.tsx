import React from 'react';
import Link from 'next/link';
import { AlertCircle, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface py-6 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-foreground font-medium">
            <span className="font-serif font-bold text-sm text-primary">MedLevel</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground text-xs">Preparação Oficial ENAMED</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Política de Privacidade (LGPD)
            </Link>
            <Link href="/design" className="hover:text-foreground transition-colors font-mono">
              Design System
            </Link>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="mt-4 flex items-start space-x-2 rounded-sm border border-warning/30 bg-warning-subtle p-3 text-warning">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <strong className="font-medium">Aviso Obrigatório:</strong> Material de estudo para demonstração e preparação para o ENAMED. Não substitui diretrizes oficiais de órgãos reguladores, consensos médicos vigentes nem julgamento clínico individualizado.
          </p>
        </div>
      </div>
    </footer>
  );
}
