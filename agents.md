---
description: Diretrizes de comportamento para o agente Jules AI.
---

# Diretrizes do Jules AI para o Projeto Xtage

Você está operando dentro do projeto de código **Xtage**. O desenvolvimento neste ecossistema é guiado por regras estritas definidas pelo usuário e gerenciadas pela arquitetura "Antigravity". 

**Como Jules AI, você DEVE absorver e seguir as regras abaixo em TODAS as sessões de código neste repositório.** A não adesão resultará em falhas de arquitetura e pull requests rejeitados.

## 1. Regras Universais (Global Mandatory)
- **Comunicação e Código**: Converse sempre em Português Brasileiro (comentários em código e explicações). **Exceto a estrutura do código (nomes de variáveis, classes, funções), que DEVE permanecer em inglês.**
- **Qualidade do Código**: Escreva código limpo, direto e sem super-engenharia.
- **Evite Alucinação de Bibliotecas**: Se precisar de uma dependência nova para resolver um problema, prefira métodos nativos. Se for inevitável, adicione ao `package.json` correto (`web/` ou `mobile/`).

## 2. Padrões de Componentes e Diretórios
O projeto é um monorepo particionado:
- `web/`: Aplicação front-end Next.js (React).
- `mobile/`: Aplicação mobile.
- `supabase/`: Funções de borda, migrações e banco de dados.

**Ao executar tarefas na pasta `web/`**:
- Modificações de interface devem focar em estéticas ricas, cores premium e *micro-animações*. O design deve impressionar.
- Utilize puramente os padrões de TailwindCSS locais quando estiverem dispostos e preserve a hierarquia de `src/components`.

## 3. O "Socratic Gate" (Protocolo de Dúvida)
Se a sua instrução de sessão (o prompt da tarefa) for vaga, genérica, envolver a construção de uma funcionalidade complexa (feature nova) ou uma refatoração arquitetural profunda, **NÃO COMECE A SUBSTITUIR ARQUIVOS**.
Em vez disso, faça um comentário ou questione pelo sistema do Jules aguardando clareza sobre trade-offs, edge cases e o escopo da funcionalidade desejada.

## 4. Segurança e Chaves
- Nunca, sob nenhuma circunstância, logue, altere, suba em commits ou exponha dados da chave `ASAAS_API_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`.

**Ao implementar essas regras de forma assíncrona, você atua como um parceiro 100% alinhado ao squad Antigravity.**
