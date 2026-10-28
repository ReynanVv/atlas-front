# Atlas Frontend

## Produto e stack

- Produto e regras: `PRODUCT.md`.
- Arquitetura: `docs/architecture.md`.
- React 18 + Vite 6 + JavaScript.
- API oficial: Atlas API dedicada; não voltar ao backend do ControlFinance.

## Comandos

- Instalar: `npm install`
- Dev: `npm run dev`
- Testes: `npm test`
- Quality: `npm run quality`
- Build: `npm run build`
- Verificação: `npm run verify`

## Acordos

- Preserve as regras de `PRODUCT.md`.
- "Intensidade" foi removida do produto.
- UI deve continuar funcional em desktop e mobile.
- Feedback de ações deve seguir `docs/feedback.md`; loading fica no controle local e acknowledgements globais só entram quando o resultado não é autoevidente.
- Chamadas HTTP compartilhadas pertencem a `src/lib/api.js`.
- Novos módulos JS/JSX devem ficar abaixo de 350 linhas; `src/App.jsx` é legado temporário.
- Refatore por responsabilidade, nunca por corte arbitrário de linhas.
- Não altere autenticação, URL de produção ou contrato de API sem verificar impacto.
- Rode `npm run verify` em mudanças relevantes.
- Atualize o documento responsável quando uma decisão mudar.
