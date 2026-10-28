# Onboarding de desenvolvimento

## Pré-requisitos

- Node.js 20+
- npm
- acesso ao repositório
- backend Atlas disponível

## Executar

```bash
npm install
npm run dev
```

## Verificar

```bash
npm run verify
```

## Variável opcional

```env
VITE_API_URL=https://atlas-api-vkr4.onrender.com/atlas-api
```

Sem a variável, o frontend usa a URL oficial como fallback.

## Smoke test manual

1. entrar como treinador;
2. gerar convite;
3. abrir como aluno e aceitar;
4. salvar disponibilidade;
5. prescrever treino;
6. iniciar, registrar séries e concluir;
7. conferir histórico/evolução.
