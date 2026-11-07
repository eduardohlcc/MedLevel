# Lista Completa de Tarefas do Projeto MedLevel

Este documento consolida o planejamento detalhado das tarefas para o MVP da plataforma MedLevel, com o status atualizado de cada entrega.

---

## 🏗️ Tarefas de Infraestrutura e Fundação [fase-0]

### T-001 [infra] Configuração da Estrutura Monorepo e Docker Compose
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Criar a estrutura de diretórios (`/frontend`, `/backend`, `/docs`), configurar o arquivo `docker-compose.yml` para o PostgreSQL 16 Alpine, `.env.example`, `.gitignore`, `.prettierrc` e scripts de automação.
- **Critérios de Aceite**:
  1. O comando `docker compose up -d` sobe o contêiner do Postgres na porta 5432 com healthcheck ativo.
  2. Todas as variáveis de ambiente necessárias estão documentadas em `.env.example` sem segredos.
  3. Prettier e ESLint formatam e validam o repositório sem falhas.
- **Dependências**: Nenhuma.

### T-002 [docs] Especificação do Contrato de API OpenAPI/Swagger
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Documentar todos os schemas, requisições e respostas de endpoints em `/docs/openapi.yaml`.
- **Critérios de Aceite**:
  1. O arquivo `openapi.yaml` valida sem erros em ferramentas OpenAPI 3.0+.
  2. Todos os endpoints do MVP (auth, questions, attempts, exams, reviews, study-plan, admin) estão detalhados com tipos de entrada e saída.
- **Dependências**: T-001.

### T-003 [docs] Guia de Contribuição e Design System
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Criar `docs/CONTRIBUINDO.md`, `docs/DESIGN.md`, `docs/ARQUITETURA.md` e `docs/DECISOES.md`.
- **Critérios de Aceite**:
  1. Fluxo de Git branches (`main`, `develop`, `feat/*`) e padrão Conventional Commits especificados.
  2. Design tokens (cores, fontes, espaçamentos) e regras de acessibilidade WCAG AA descritos.
- **Dependências**: T-001.

---

## ⚙️ Tarefas de Backend [backend]

### T-101 [backend] Modelagem de Dados e Migrations Prisma
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Criar o schema Prisma com as entidades: `User`, `Topic`, `Question`, `Alternative`, `Attempt`, `ExamSession`, `ExamSessionQuestion`, `ReviewCard` (campos SM-2) e `StudyPlan`.
- **Critérios de Aceite**:
  1. Relações 1:N e N:N entre entidades devidamente mapeadas com chaves estrangeiras e índices otimizados.
  2. Prisma Client gerado e exportado para injeção de dependência no NestJS.
- **Dependências**: T-001.

### T-102 [backend] Seeds com 40 Questões Médicas Originais
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Desenvolver script de seed em TypeScript para popular as 5 grandes áreas da medicina (Clínica Médica, Cirurgia, Pediatria, Ginecologia/Obstetrícia, Saúde Coletiva), tópicos e 40 questões originais de demonstração com 4 alternativas e gabarito comentado.
- **Critérios de Aceite**:
  1. O script `backend/prisma/seed.ts` popula 40 questões originais e balanceadas com 4 alternativas cada.
  2. Todas as questões contêm a marcação explícita de demonstração não revisada.
  3. Criação de usuário estudante e administrador padrão para testes.
- **Dependências**: T-101.

### T-103 [backend] Módulo de Autenticação JWT e Segurança
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Implementar endpoints de cadastro (`/auth/register`), login (`/auth/login`), refresh token (`/auth/refresh`), logout e recuperação de senha simulada (`/auth/forgot-password`). Senhas com hash bcrypt, guards JWT e rate limiting.
- **Critérios de Aceite**:
  1. Cadastro valida unicidade de e-mail e hash da senha com bcrypt.
  2. Login retorna JWT access token (15 min) e refresh token (7 dias).
  3. Rotas protegidas barram acessos com token inválido/expirado com código HTTP 401.
  4. Validação estrita de DTOs com `class-validator` e Throttler (rate limiting).
- **Dependências**: T-101.

### T-104 [backend] Módulo do Banco de Questões
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Desenvolver endpoints de listagem com filtros avançados (`/questions?area=&topic=&difficulty=&year=&search=&page=&limit=`) e busca por ID (`/questions/:id`).
- **Critérios de Aceite**:
  1. Filtros combinados funcionam com paginação estruturada (`data`, `total`, `page`, `totalPages`).
  2. Busca textual case-insensitive no enunciado.
  3. Alternativas são retornadas sem expor se são a correta antes da resolução avulsa.
- **Dependências**: T-101, T-102.

### T-105 [backend] Módulo de Tentativas e Resolução de Questões
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Implementar registro de resposta do aluno (`POST /questions/:id/attempt`), calculando se acertou, registrando tempo gasto e atualizando/criando automaticamente o `ReviewCard` (caso tenha errado).
- **Critérios de Aceite**:
  1. Retorna o gabarito oficial, explicação detalhada e confirmação de acerto/erro.
  2. Quando a resposta for incorreta, adiciona ou atualiza o cartão de revisão com data de vencimento.
  3. Registra tempo em segundos gasto pelo estudante.
- **Dependências**: T-104.

### T-106 [backend] Módulo de Simulados (Exam Session)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Endpoints para iniciar simulado (`POST /exams`), buscar questão atual (`GET /exams/:id`), submeter respostas (`POST /exams/:id/answers`), finalizar (`POST /exams/:id/finish`) e gerar relatório consolidado (`GET /exams/:id/report`). Suporte ao modo ENAMED (100 questões, 5 horas) e modo personalizado.
- **Critérios de Aceite**:
  1. O simulado ENAMED seleciona 100 questões balanceadas pelas 5 grandes áreas.
  2. O simulado bloqueia submissões após o tempo limite de 5 horas.
  3. O relatório final detalha acertos por grande área, tempo total e nota percentual.
- **Dependências**: T-104, T-105.

### T-107 [backend] Módulo de Repetição Espaçada e Caderno de Erros (SM-2)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Implementar o cálculo SM-2 e endpoints para listar itens pendentes de revisão para o dia atual (`GET /reviews/today`) e computar feedback de revisão (`POST /reviews/:id/grade`).
- **Critérios de Aceite**:
  1. Aplicação da fórmula canônica do SM-2: atualização de `easeFactor` (mínimo 1.3), `repetitions` e cálculo do novo `interval`.
  2. Filtro automático de questões cuja `dueDate <= hoje`.
- **Dependências**: T-105.

### T-108 [backend] Módulo de Painel de Evolução e Estatísticas
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Endpoint agregador (`GET /dashboard/stats`) que calcula taxa de acertos geral, por grande área, evolução temporal semanal, tempo médio de resposta e pontos fracos/fortes.
- **Critérios de Aceite**:
  1. Retorna métricas numéricas precisas calculadas a partir da tabela `Attempt`.
  2. Lista os tópicos com pior desempenho para direcionamento de estudos.
- **Dependências**: T-105, T-106.

### T-109 [backend] Módulo de Plano de Estudos
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Endpoints para salvar preferências de estudo (`POST /study-plan`: data da prova, horas semanais) e obter cronograma diário sugerido de temas (`GET /study-plan`).
- **Critérios de Aceite**:
  1. Calcula dias restantes até a prova e distribui as metas diárias recomendadas.
  2. Prioriza temas com maior incidência de erros no caderno de erros do estudante.
- **Dependências**: T-107, T-108.

### T-110 [backend] Módulo de Administração de Questões
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Endpoints para criar, editar, alterar status (`DRAFT`, `REVIEWED`, `PUBLISHED`) e importar lote de questões via JSON (`POST /admin/questions/import`).
- **Critérios de Aceite**:
  1. Acesso restrito a usuários com role `ADMIN`.
  2. Importação em lote valida integridade dos campos e cria alternativas atomicamente.
- **Dependências**: T-104.

---

## 🎨 Tarefas de Frontend [frontend]

### T-201 [frontend] Setup Next.js, Design Tokens e Tipografia
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Configurar Next.js 14+ (App Router) com Tailwind CSS e variáveis de design tokens (fundo off-white `#F6F4EF`, grafite `#1C1F1D`, verde-petróleo `#0F4C4A`, âmbar `#B4691F`, bordas `#D9D5CB`, tema escuro, fontes Google Fonts `Source Serif 4`, `IBM Plex Sans`, `IBM Plex Mono`).
- **Critérios de Aceite**:
  1. Cores e fontes configuradas exclusivamente via classes semânticas do Tailwind (`bg-background`, `text-foreground`, `font-serif`, `font-mono`).
  2. Suporte a tema claro e escuro sem flashes visuais (class-based dark mode).
  3. Aviso obrigatório médico inserido no rodapé global.
- **Dependências**: T-001.

### T-202 [frontend] Biblioteca de Componentes Base (UI Kit) e Página `/design`
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Criar componentes acessíveis em `src/components/ui`: Button, Input, Select, Badge, Card, Alert, Progress. Criar rota interna `/design` que exibe a galeria interativa de todos os componentes e variantes.
- **Critérios de Aceite**:
  1. Todos os componentes possuem foco visível e suporte a navegação por teclado (WCAG AA).
  2. Microinterações discretas entre 150ms e 200ms.
  3. Página `/design` exibe tipografia, botões em todos os estados, badges semânticos e formulários.
- **Dependências**: T-201.

### T-203 [frontend] Camada de API e Mocks com MSW
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Implementar cliente de API tipado em `src/lib/api/client.ts` e handlers Mock Service Worker (MSW) em `src/mocks/handlers.ts` cobrindo todos os endpoints de `/docs/openapi.yaml`.
- **Critérios de Aceite**:
  1. Alternar `NEXT_PUBLIC_USE_MOCKS=true` intercepta chamadas no navegador e provê dados simulados instantâneos.
  2. Tipos TypeScript exportados em `src/types/api.ts` refletem com precisão o contrato OpenAPI.
- **Dependências**: T-002, T-201.

### T-204 [frontend] Telas de Autenticação e Perfil
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Telas de login (`/login`), cadastro (`/cadastro`), recuperação de senha (`/recuperar-senha`), política de privacidade (`/privacidade`), termos de uso (`/termos`) e perfil/configurações (`/perfil`).
- **Critérios de Aceite**:
  1. Formulários validados com mensagens em pt-BR.
  2. Consentimento LGPD com checkbox obrigatório no cadastro.
  3. Opção de logout e botão para exclusão de conta em `/perfil`.
- **Dependências**: T-202, T-203.

### T-205 [frontend] Tela de Painel de Evolução (Dashboard)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Rota principal autenticada (`/painel`) com cartões de resumo (taxa de acerto global, questões resolvidas, tempo médio), gráfico de desempenho por grande área, gráfico de evolução semanal (Recharts) e atalhos rápidos.
- **Critérios de Aceite**:
  1. Gráficos sóbrios, sem efeitos neon ou decorações desnecessárias.
  2. Carregamento com skeleton loaders elegantes durante busca de dados.
- **Dependências**: T-202, T-203.

### T-206 [frontend] Banco de Questões (Filtros e Listagem)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Tela `/questoes` com busca textual, filtros múltiplos por Grande Área e Dificuldade, lista de questões com tags de status e paginação.
- **Critérios de Aceite**:
  1. Filtros combinados com busca instantânea.
  2. Listagem clara indicando código, grande área e subtema.
- **Dependências**: T-202, T-203.

### T-207 [frontend] Tela de Resolução de Questão
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Rota `/questoes/[id]` otimizada para foco: coluna de leitura confortável (max 75ch), enunciado claro, 4 alternativas com rádio estilizado, cronômetro de tempo por questão, botão de confirmação, gabarito comentado e botão de marcar para revisão.
- **Critérios de Aceite**:
  1. Após confirmação, destaca visualmente a alternativa correta (verde) e a selecionada (vermelho se errada).
  2. Exibe a justificativa fundamentada de cada alternativa.
  3. Registra o tempo gasto com precisão de segundos.
- **Dependências**: T-202, T-203.

### T-208 [frontend] Módulo de Simulados (Modo ENAMED e Personalizado)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Telas de configuração (`/simulados`), ambiente de execução da prova (`/simulados/[id]`) e relatório pós-prova (`/simulados/[id]/resultado`).
- **Critérios de Aceite**:
  1. Navegador lateral com grade numérica de questões (1 a 100), sinalizando respondidas, em branco e marcadas para revisão.
  2. Cronômetro regressivo com alerta discreto nos últimos 15 minutos.
  3. Modal de confirmação antes do envio final.
  4. Tela de resultado com pontuação por área e revisão questão por questão.
- **Dependências**: T-207.

### T-209 [frontend] Tela do Caderno de Erros e Revisão de Hoje
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Tela `/revisao` exibindo quantidade de itens pendentes para o dia, fila de cartões SM-2 com modo flashcard/questão e botões de classificação de retenção (0 a 5).
- **Critérios de Aceite**:
  1. Fila de revisão permite repassar as questões erradas com facilidade.
  2. Feedback do usuário atualiza imediatamente o contador do dia e agenda o próximo intervalo.
- **Dependências**: T-202, T-203.

### T-210 [frontend] Tela do Plano de Estudos
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Tela `/plano-de-estudos` permitindo definir data limite do ENAMED e disponibilidade semanal, com exibição de metas diárias recomendadas baseadas nas áreas de maior fragilidade.
- **Critérios de Aceite**:
  1. Exibe contador de dias até o exame oficial.
  2. Lista de temas diários sugeridos com direcionamento prático.
- **Dependências**: T-205, T-209.

### T-211 [frontend] Painel Administrativo de Questões
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Área restrita `/admin/questoes` com cadastro de novas questões, seleção de 4 alternativas e importador de lote em formato JSON.
- **Critérios de Aceite**:
  1. Interface de criação com seleção de tema, enunciado, 4 alternativas e justificativa do gabarito.
  2. Importação em lote de array JSON.
- **Dependências**: T-202, T-203.

---

## 🧪 Tarefas de Testes e Qualidade [testes]

### T-301 [testes] Testes Unitários de Lógica de Negócio (Backend)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Testes com Jest para o algoritmo SM-2 e cálculo de regras do simulado ENAMED.
- **Critérios de Aceite**:
  1. 100% de cobertura nos métodos matemáticos do SM-2 (`backend/test/sm2.spec.ts`).
  2. Validação dos cálculos de duração e pontuação de simulado (`backend/test/exams.spec.ts`).
- **Dependências**: T-107.

### T-302 [testes] Teste End-to-End com Playwright (Fluxo Crítico)
- **Status**: ✅ **CONCLUÍDO**
- **Descrição**: Configurar Playwright para testar o fluxo principal: autenticação -> navegação ao banco -> resolução de questão -> gabarito e feedback comentado.
- **Critérios de Aceite**:
  1. Teste e2e estruturado em `e2e/main-flow.spec.ts` com configuração em `playwright.config.ts`.
- **Dependências**: T-204, T-207.
