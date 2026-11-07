import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Termos de Uso
        </h1>
        <p className="mt-1 text-xs text-muted-foreground font-mono">
          Última atualização: Novembro de 2026
        </p>
      </div>

      <div className="mt-8 space-y-6 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">1. Finalidade Educacional</h2>
          <p className="mt-2 text-muted-foreground">
            A plataforma MedLevel é uma ferramenta tecnológica de apoio ao estudo e autoavaliação, voltada a estudantes de graduação em Medicina e candidatos ao Exame Nacional de Avaliação da Formação Médica (ENAMED). Todo o conteúdo tem propósito estritamente pedagógico e preparatório para exames teóricos.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">2. Limitação de Responsabilidade Clínica</h2>
          <p className="mt-2 text-muted-foreground">
            As vinhetas clínicas, questões, gabaritos e explicações disponibilizadas no sistema não constituem, em hipótese alguma, diretriz clínica oficial, prescrição médica, protocolo assistencial hospitalar nem orientação para condutas diagnósticas ou terapêuticas em pacientes reais. A prática médica exige julgamento clínico individualizado.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">3. Direitos Autorais e Conteúdo Original</h2>
          <p className="mt-2 text-muted-foreground">
            As questões originais de demonstração foram elaboradas especificamente para a plataforma MedLevel. É proibida a reprodução não autorizada, comercialização ou scraping automatizado do banco de questões sem autorização prévia por escrito.
          </p>
        </section>
      </div>
    </div>
  );
}
