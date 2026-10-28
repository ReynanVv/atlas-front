# Qualidade

## Gate canônico

```bash
npm run verify
```

Executa quality gates, testes e build.

## Invariantes automatizados

- novos arquivos JS/JSX: máximo de 350 linhas;
- `src/App.jsx` está temporariamente grandfathered e gera aviso;
- "intensidade" não pode reaparecer no código-fonte;
- a URL antiga do ControlFinance não pode reaparecer.

## Estratégia de legado

Não transformar toda dívida antiga em erro de uma vez. Primeiro impedir dívida nova; depois reduzir o legado em cortes por responsabilidade.

Próximo alvo: extrair autenticação e navegação de `src/App.jsx`, verificando a aplicação após cada corte.
