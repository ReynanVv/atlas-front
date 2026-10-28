# Atlas — Produto e escopo do MVP

## Problema

O Atlas conecta treinadores e alunos para organizar prescrição, execução e acompanhamento de treinos sem depender de planilhas, mensagens dispersas ou cadastros manuais de alunos pelo treinador.

## Atores

- **Aluno:** recebe convites, informa disponibilidade, executa treinos, registra séries, acompanha evolução e conversa com treinadores.
- **Treinador:** convida alunos por link, acompanha vínculos e disponibilidade, mantém biblioteca e templates, prescreve treinos, acompanha progresso e conversa com alunos.
- **Usuário com múltiplos perfis:** a mesma conta pode ter perfil de aluno e treinador e alternar o perfil ativo.

## Regras do MVP

1. Convite é feito por **link**; o treinador não informa e-mail do aluno.
2. Um treinador pode ter zero ou mais alunos.
3. Um aluno pode ter um ou mais treinadores.
4. A disponibilidade pertence ao aluno.
5. O treinador só prescreve em dias disponíveis do aluno.
6. Treinos podem ser criados do zero ou por template.
7. Exercícios usam séries, repetições, carga sugerida, descanso, observação e vídeo.
8. O aluno registra o executado por série e conclui a sessão.
9. Histórico e evolução derivam das sessões registradas.
10. Mensagens só existem entre treinador e aluno vinculados.
11. Notificações cobrem prescrição, mensagem e lembrete de treino.
12. **Intensidade não faz parte do domínio do Atlas** e não deve voltar para interface, payloads ou regras.
13. Uma prescrição pode ser editada por completo enquanto ainda não houver sessão iniciada. Depois do primeiro início, ela fica imutável para preservar o histórico.
14. Treinadores podem optar por perfil público ou privado; alunos podem encontrar e se vincular diretamente apenas a perfis públicos.
15. Um treino pode conter qualquer quantidade de prescrições, com nomes livres, dias, duração, observações e exercícios próprios; não existe dependência de modelos AB/ABC.
16. A criação de treino não usa horário sugerido.
17. A biblioteca separa exercícios pessoais e externos; a fonte externa inicial é o wger com prioridade para pt-BR.
18. Template representa sempre o treino completo. Ao carregar um template, cada prescrição permanece separada com seus próprios exercícios, dias, duração e observações; prescrições não são fundidas.

## Escopo implementado

Cadastro, login, sessão persistente, logout, perfis, convite por link, disponibilidade, alunos vinculados, biblioteca, templates, prescrição, execução, histórico, evolução, dashboard do treinador, mensagens, notificações, relatório CSV e cópia de treino.

## Lacunas conhecidas

- a API possui edição de exercício, mas a interface ainda não oferece todo o fluxo;
- `src/App.jsx` é um arquivo legado grande e será refatorado incrementalmente;
- o backend dedicado ainda contém partes herdadas do ControlFinance.

## Fora do escopo atual

Cobrança, marketplace, nutrição, wearables, prescrição automática por IA, WebSocket e migração de stack apenas para seguir templates.

20. O treinador pode desvincular um aluno sem apagar conta, treinos, sessões, histórico ou mensagens antigas. A desvinculação encerra apenas a relação ativa e impede novas ações que dependem do vínculo até que ele seja criado novamente.

21. Perfis públicos não criam vínculo automaticamente. O aluno envia uma solicitação com mensagem opcional; o treinador aceita ou recusa. O vínculo só nasce no aceite.

22. Alunos que concluíram ao menos uma sessão prescrita por um professor podem avaliá-lo de 1 a 5 estrelas com comentário opcional. Cada aluno possui uma avaliação por professor, que pode ser atualizada. A média e a quantidade de avaliações aparecem no perfil público.
