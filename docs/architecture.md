# Arquitetura do frontend

## Estado atual

SPA React/Vite. `src/App.jsx` ainda concentra telas e orquestração do MVP. A adoção do toolkit preserva a stack e refatora incrementalmente.

## Fronteiras

- `src/main.jsx`: bootstrap React.
- `src/App.jsx`: composição principal e telas legadas.
- `src/lib/api.js`: fronteira compartilhada para HTTP, blob e token local.
- `src/lib/format.js`: utilidades puras e testáveis.
- `src/styles.css`: estilos globais legados.

## API

URL padrão: `https://atlas-api-vkr4.onrender.com/atlas-api`.

Pode ser sobrescrita por `VITE_API_URL` no build. Não voltar a apontar para `controlfinance-app`.

## Direção de refatoração

Extrair por domínios naturais: `auth/`, `student/`, `trainer/`, `workouts/`, `messages/`, `notifications/`, `components/` e `lib/`.

Não criar abstrações vazias só para reduzir linhas. Preservar comportamento e rodar `npm run verify` após cada corte.
