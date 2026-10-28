# Registro de setup

## Adoção do Vibe Coding Toolkit

Modo: **projeto existente**, preservando stack e contratos.

### Aplicado

- documentação de produto e arquitetura;
- `AGENTS.md` e ponte `CLAUDE.md`;
- quality gate local;
- testes Node sem dependência adicional;
- CI no GitHub;
- fronteira HTTP em `src/lib/api.js`;
- utility pura em `src/lib/format.js`.

### Não aplicado de propósito

- migração para Next.js;
- troca de banco/ORM;
- formatter global;
- Graphify/Context7 como dependência do repositório;
- hooks de commit/push.

### Pendências

- continuar refatoração de `src/App.jsx`;
- ampliar testes dos fluxos críticos;
- adicionar testes de navegador quando houver runner apropriado;
- revisão de segurança de autenticação, ownership e uploads.
