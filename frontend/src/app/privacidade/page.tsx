import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Política de Privacidade e Proteção de Dados (LGPD)
        </h1>
        <p className="mt-1 text-xs text-muted-foreground font-mono">
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
        </p>
      </div>

      <div className="mt-8 space-y-6 text-sm text-foreground leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">1. Dados Coletados e Finalidade</h2>
          <p className="mt-2 text-muted-foreground">
            Coletamos apenas as informações estritamente necessárias para a prestação dos serviços educacionais: nome completo, endereço de e-mail corporativo ou pessoal, data alvo estimada para realização do exame oficial e preferências de horas de estudo. Dados de desempenho (questões respondidas, acertos, erros e tempo gasto) são processados exclusivamente para alimentar os algoritmos de repetição espaçada (SM-2) e os gráficos de evolução do próprio estudante.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">2. Segurança e Não Compartilhamento</h2>
          <p className="mt-2 text-muted-foreground">
            As senhas de acesso são armazenadas de forma irreversível utilizando algoritmo de hash criptográfico com salt (bcrypt). O MedLevel não comercializa, não aluga e não compartilha dados pessoais ou histórico de desempenho acadêmico com terceiros, cursinhos preparatórios ou anunciantes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-foreground">3. Seus Direitos (Exclusão Definitiva de Conta)</h2>
          <p className="mt-2 text-muted-foreground">
            Em total respeito aos direitos do titular previstos no Artigo 18 da LGPD, o estudante pode a qualquer momento acessar seu painel de configurações de perfil e solicitar a exclusão definitiva e irreversível de sua conta e de todo o histórico de tentativas do banco de dados, sem necessidade de justificativa prévia.
          </p>
        </section>
      </div>
    </div>
  );
}
