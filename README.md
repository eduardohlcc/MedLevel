# MedLevel 🩺

> Plataforma web de alta performance para estudantes de Medicina no Brasil se prepararem para o **ENAMED** (*Exame Nacional de Avaliação da Formação Médica*).

---

> [!IMPORTANT]
> **Aviso Obrigatório**: Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica médica.

---

## 📌 Visão Geral

O MedLevel reúne em um ambiente editorial, sóbrio e focado:
- **Banco de Questões**: Enunciados clínicos com filtros por Grande Área (Clínica Médica, Cirurgia, Pediatria, Ginecologia/Obstetrícia, Saúde Coletiva), temas, dificuldade, ano e busca textual.
- **Simulados**:
  - **Modo Oficial ENAMED**: 100 questões objetivas, 4 alternativas (apenas uma correta), cronômetro regressivo de 5 horas (300 minutos), navegação rápida e relatório detalhado pós-prova.
  - **Modo Personalizado**: Escolha de número de questões e grandes áreas específicas para treino direcionado.
- **Caderno de Erros com Repetição Espaçada**: Questões erradas entram automaticamente no algoritmo **SM-2 (SuperMemo 2)**, gerando a fila diária na tela "Revisão de hoje".
- **Painel de Evolução**: Métricas precisas de acertos por área, evolução semanal, tempo médio por questão e identificação de fraquezas clínicas.
- **Plano de Estudos**: Cronograma diário sugerido a partir da data informada da prova e horas de estudo semanais.
- **Área Administrativa**: Moderação, cadastro e importação em lote (JSON) de novas questões com status de rascunho, revisada e publicada.

---

## 🏛️ Arquitetura e Stack Tecnológica

O projeto é estruturado como um monorepo modular e desacoplado:

```
/frontend        Aplicação Next.js 14+ (App Router, Tailwind CSS, Radix UI, TanStack Query)
/backend         API NestJS (TypeScript, Prisma ORM, PostgreSQL, JWT, class-validator)
/docs            Documentação técnica, decisões e especificações
├── ARQUITETURA.md    Especificação detalhada de arquitetura e SM-2
├── DECISOES.md       Registro de decisões de produto e arquitetura (ADR)
├── TAREFAS.md        Backlog completo e detalhado com critérios de aceite
├── DESIGN.md         Design tokens, paleta de cores, tipografia e regras de UI
├── CONTRIBUINDO.md   Guia de Git Flow, branches, commits e checklist de revisão
└── openapi.yaml      Contrato REST OpenAPI 3.0 formal
/docker-compose.yml   PostgreSQL 16 Alpine
/.env.example         Template de variáveis de ambiente sem segredos
/README.md            Guia de início rápido e execução
```

### Principais Tecnologias:
- **Frontend**: Next.js 14+ (App Router), TypeScript estrito, Tailwind CSS, Radix UI (acessibilidade WCAG AA), Recharts, React Hook Form, Zod, TanStack Query v5, Mock Service Worker (MSW).
- **Backend**: Node.js com NestJS, Prisma ORM, PostgreSQL 16, JWT (Access + Refresh tokens), bcrypt, class-validator, Swagger/OpenAPI.
- **Qualidade e Testes**: Vitest, Jest e Playwright.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 20+ (ou 22+)
- Docker e Docker Compose (caso queira rodar o banco de dados PostgreSQL localmente)

---

### Opção 1: Rodar o Frontend Isolado com Mocks (Ideal para desenvolvimento front-end)
O frontend não necessita do backend nem do banco de dados para ser desenvolvido ou testado.

1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Configure o ambiente para mocks no arquivo `.env.local`:
   ```bash
   cp .env.example .env.local
   # Certifique-se de que NEXT_PUBLIC_USE_MOCKS=true
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```
4. Acesse:
   - Aplicação: [http://localhost:3000](http://localhost:3000)
   - Galeria de Componentes: [http://localhost:3000/design](http://localhost:3000/design)

---

### Opção 2: Rodar a Aplicação Completa (Backend + Frontend + PostgreSQL)

1. **Copie as variáveis de ambiente na raiz**:
   ```bash
   cp .env.example .env
   ```

2. **Inicie o banco de dados PostgreSQL**:
   ```bash
   docker compose up -d
   ```

3. **Configure e inicie o Backend**:
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run start:dev
   ```
   A API estará rodando em [http://localhost:4000/api/v1](http://localhost:4000/api/v1).  
   Documentação Swagger interativa: [http://localhost:4000/api/docs](http://localhost:4000/api/docs).

4. **Inicie o Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Para conectar à API real, mantenha NEXT_PUBLIC_USE_MOCKS=false no frontend/.env.local
   npm run dev
   ```

---

## 🎨 Design System e Identidade Visual

- **Paleta Editorial Contida**: Fundo off-white quente (`#F6F4EF`), grafite profundo (`#1C1F1D`), verde-petróleo profundo (`#0F4C4A`), âmbar queimado (`#B4691F`) e bordas finas em `#D9D5CB`.
- **Tipografia**: `Source Serif 4` (títulos e vinhetas clínicas), `IBM Plex Sans` (interface geral), e `IBM Plex Mono` (cronômetros e métricas).
- **Consulte mais detalhes** em [docs/DESIGN.md](docs/DESIGN.md).

---

## 🤝 Contribuição e Git Flow

Consulte o guia completo em [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md) para:
- Padrão de branches (`main`, `develop`, `feat/*`);
- Padrão de Conventional Commits (`feat:`, `fix:`, `docs:`, etc.);
- Como abrir Pull Requests e checklist de revisão de código.

---

## ⚖️ Licença e Privacidade

Projeto desenvolvido em conformidade com as diretrizes da LGPD (Lei Geral de Proteção de Dados). Termos e Política disponíveis no aplicativo.
