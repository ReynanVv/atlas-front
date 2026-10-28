# Visibilidade do status do sistema

## Objetivo

Toda ação relevante deve deixar claro se está em andamento, se foi concluída ou se falhou, sem transformar cada clique em uma notificação.

## Contrato semântico

A aplicação emite quatro tipos de acknowledgement:

- `success`: uma alteração foi persistida e o efeito não é autoevidente;
- `error`: uma ação falhou e o contexto local não é suficiente ou pode desaparecer;
- `info`: um resultado neutro merece confirmação;
- `warning`: a ação foi aceita, mas existe uma condição importante.

O contrato fica em `src/lib/feedback.js`. A apresentação web fica em `src/ui/FeedbackProvider.jsx`.

## Quando usar feedback global

Usar para ações como:

- salvar ou editar um treino quando a tela navega em seguida;
- salvar um template;
- copiar um link;
- concluir uma prescrição;
- gerar/download de relatório;
- exportar/copiar treino;
- criar ou excluir exercício/template;
- enviar lembrete.

## Quando NÃO usar

Não criar toast para:

- mudar aba ou página;
- abrir/fechar modal;
- selecionar item;
- digitar/buscar;
- salvar uma série quando o próprio check muda visualmente;
- enviar mensagem quando a bolha aparece imediatamente;
- carregar um template quando o formulário muda visivelmente;
- vincular professor quando o próprio card muda para “Vinculado”.

## Loading

Loading pertence ao controle que iniciou a ação: botão muda texto, fica desabilitado ou mostra estado local. Não usar toast de “Carregando...” para ações comuns.

## Erros

Erros de validação permanecem próximos do formulário. Erros assíncronos continuam em banners locais quando o usuário precisa corrigir algo naquele contexto. Feedback global é reservado para falhas cujo contexto some ou para ações de sistema fora de formulário.

## Mobile

A camada de produto chama apenas `success/error/info/warning`. No mobile, mantenha o mesmo contrato e substitua apenas o renderer web por Snackbar/Toast nativo. Não coloque dependência de DOM, posição de tela ou CSS nas regras de negócio.
