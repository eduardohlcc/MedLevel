# Guia de Contribuição - MedLevel

Agradecemos o interesse em contribuir com o MedLevel! Para manter a excelência técnica, a consistência de código e a agilidade nas entregas, siga atentamente este guia.

---

## 1. Fluxo de Branches (Git Flow Simplificado)

Adotamos uma ramificação estruturada:
- `main`: Código de produção estável, pronto para deploy.
- `develop`: Branch de integração contínua do time de desenvolvimento.
- `feat/<nome-da-funcionalidade>`: Branches de novas funcionalidades (ex.: `feat/questao-cronometro`, `feat/algoritmo-sm2`).
- `fix/<nome-do-bug>`: Correções de defeitos encontrados.
- `docs/<escopo>`: Alterações exclusivas de documentação.

---

## 2. Padrão de Commits (Conventional Commits)

Todas as mensagens de commit devem seguir estritamente o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição em inglês no imperativo>

[corpo opcional explicando o motivo e contexto]

[rodapé opcional referenciando tarefas, ex: Closes T-105]
```

### Tipos permitidos:
- `feat`: Nova funcionalidade para o usuário ou API.
- `fix`: Correção de bug.
- `docs`: Modificações apenas na documentação.
- `style`: Formatação, ponto e vírgula, sem alteração de lógica.
- `refactor`: Refatoração de código que não altera comportamento.
- `test`: Adição ou refatoração de testes automatizados.
- `chore`: Atualização de dependências, build ou configurações.

### Exemplos válidos:
- `feat(auth): implement refresh token rotation and argon2 hashing`
- `fix(sm2): clamp minimum ease factor to 1.3 according to spec`
- `docs(api): document exam session submission contract in openapi.yaml`

---

## 3. Como Rodar o Frontend Isoladamente (Modo Mocks)

O desenvolvedor frontend **não precisa** ter o backend NestJS nem o contêiner PostgreSQL rodando para desenvolver e testar qualquer tela da aplicação.

1. Navegue até `/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Crie ou ajuste o arquivo `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_MOCKS=true
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000`. Todas as requisições para a API serão interceptadas localmente pelo Mock Service Worker (MSW), simulando login, banco de questões, resolução e simulados.

---

## 4. Como Abrir um Pull Request (PR)

1. Crie sua branch a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/minha-tarefa
   ```
2. Execute o linter e certifique-se de que não há erros de tipagem:
   ```bash
   npm run lint
   npm run typecheck
   ```
3. Execute a suíte de testes:
   ```bash
   npm run test
   ```
4. Abra o Pull Request apontando para `develop`.
5. Preencha a descrição do PR explicando:
   - Resumo da mudança;
   - Tarefa correspondente de `/docs/TAREFAS.md`;
   - Como testar manualmente.

---

## 5. Checklist de Revisão (Code Review)

- [ ] Código escrito em TypeScript estrito, sem uso de `any` sem justificativa sólida.
- [ ] Nenhum segredo, senha ou chave de API adicionada ao repositório.
- [ ] Textos da interface em português do Brasil (pt-BR); nomes de variáveis e funções em inglês.
- [ ] Design Tokens respeitados (cores e fontes do Tailwind sem valores hexadecimais soltos no JSX).
- [ ] Acessibilidade: elementos interativos com foco visível e teclado funcional (WCAG AA).
- [ ] Aviso médico de demonstração mantido em locais de visualização de conteúdo clínico.
