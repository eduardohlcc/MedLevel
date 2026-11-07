# Registro de Decisões de Arquitetura e Produto (ADR) - MedLevel

Este documento registra as decisões tomadas ao longo do desenvolvimento do MedLevel para garantir clareza, rastreabilidade e simplicidade nas soluções adotadas.

---

## DEC-001: Parâmetros Oficiais do ENAMED no MVP
- **Contexto**: O Exame Nacional de Avaliação da Formação Médica (ENAMED) é a prova avaliativa para concluintes do curso de Medicina no Brasil. O edital prevê 100 questões de múltipla escolha com 4 alternativas cada (apenas uma correta) e tempo de resolução de 5 horas.
- **Decisão**: A prova padrão do simulado ENAMED conterá exatamente 100 questões com duração limite de 300 minutos (5 horas). No entanto, o sistema manterá esses parâmetros configuráveis no banco de dados e através de modo personalizado (onde o estudante pode escolher o número de questões e áreas).
- **Status**: Aprovado.

---

## DEC-002: Modelo de Dados das Áreas e Matriz ENAMED
- **Contexto**: A matriz curricular e as provas do ENAMED e Revalida dividem o conhecimento médico em grandes eixos: Clínica Médica, Cirurgia Geral, Pediatria, Ginecologia e Obstetrícia, e Medicina de Família e Comunidade / Saúde Coletiva.
- **Decisão**: Modelamos uma hierarquia flexível `Topic` onde cada tópico possui opcionalmente um `parentId`. Os nós raízes representam as Grandes Áreas (Clínica Médica, Cirurgia, Pediatria, Ginecologia e Obstetrícia, Saúde Coletiva). Novos eixos e subtemas podem ser criados dinamicamente sem alterar o esquema relacional.
- **Status**: Aprovado.

---

## DEC-003: Algoritmo de Repetição Espaçada (SM-2)
- **Contexto**: Para retenção eficiente dos erros dos estudantes, o MVP necessita de um Caderno de Erros automatizado.
- **Decisão**: Implementamos a variante canônica do algoritmo SuperMemo 2 (SM-2) diretamente no backend:
  - Variáveis por cartão: `repetition` (número consecutivo de acertos), `interval` (dias até a próxima revisão), `easeFactor` (fator de facilidade, mínimo de 1.3, padrão 2.5), e `dueDate` (data da próxima revisão).
  - Toda questão respondida incorretamente é cadastrada ou atualizada automaticamente na tabela `ReviewCard`.
  - Na tela "Revisão de Hoje", o aluno avalia sua retenção (escala de qualidade de 0 a 5) ou o sistema calcula o fator com base no acerto imediato.
- **Status**: Aprovado.

---

## DEC-004: Desacoplamento Frontend-Backend via Camada de API e Mocks (MSW)
- **Contexto**: O frontend deve ser desenvolvido e testado de forma completamente independente da API, permitindo trabalho paralelo e testes sem dependência de banco de dados ativo.
- **Decisão**:
  - Criamos a especificação de contrato em `/docs/openapi.yaml`.
  - No frontend, toda comunicação ocorre através de interfaces tipadas em `/frontend/src/lib/api`.
  - Caso `NEXT_PUBLIC_USE_MOCKS=true`, o Mock Service Worker (MSW) intercepta as requisições HTTP e devolve dados mockados consistentes com o contrato OpenAPI.
- **Status**: Aprovado.

---

## DEC-005: Identidade Visual e Design Editorial Sóbrio
- **Contexto**: O estudante de medicina enfrenta longas jornadas de estudo e cansaço visual. Ambientes com gradientes agressivos, emojis infantis ou elementos de marketing prejudicam a concentração e transmitem amadorismo.
- **Decisão**:
  - Paleta com fundo quente off-white (`#F6F4EF`), texto em grafite profundo (`#1C1F1D`), verde-petróleo profundo (`#0F4C4A`) como cor institucional e acento suave em âmbar queimado (`#B4691F`).
  - Fontes: `Source Serif 4` para títulos acadêmicos e editoriais, `IBM Plex Sans` para clareza em textos e formulários, e `IBM Plex Mono` para cronômetros, pontuações e estatísticas.
  - Ícones estritamente lineares da biblioteca `Lucide React` com espessura constante de 1.5 a 1.75px.
  - Ausência total de emojis decorativos, bordas excessivamente curvas (mantidas entre 4px e 6px) e sombras pesadas.
- **Status**: Aprovado.

---

## DEC-006: Geração de Conteúdo de Demonstração (Seeds)
- **Contexto**: É proibido utilizar questões com direitos autorais de cursinhos ou bancos privados sem autorização prévia.
- **Decisão**: O seed conterá 40 questões originais, contextualizadas com casos clínicos típicos do internato e da prática médica brasileira, cobrindo as 5 grandes áreas, devidamente rotuladas com o aviso obrigatório: *"Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica."*
- **Status**: Aprovado.

---

## DEC-007: Segurança e LGPD
- **Contexto**: Proteção dos dados dos estudantes e conformidade com as exigências de privacidade.
- **Decisão**:
  - Senhas com hash criptográfico utilizando bcrypt com salt rounds = 10.
  - Autenticação via JWT com access token de curta duração (15 min) e refresh token (7 dias).
  - Rate limiting nas rotas sensíveis de login e cadastro.
  - Páginas públicas de Termos de Uso e Política de Privacidade.
  - Consentimento explícito no cadastro e funcionalidade de exclusão total da conta do usuário.
- **Status**: Aprovado.
