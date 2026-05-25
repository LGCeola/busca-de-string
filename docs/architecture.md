Projeto: Busca de Strings — Arquitetura

Resumo
- Objetivo: comparar algoritmos de busca de padrão em strings, medir desempenho e ilustrar comportamento passo-a-passo.

Estrutura principal
- `src/js/strategies/`: implementações de algoritmos (Naive, KMP, Rabin-Karp, Boyer-Moore).
- `src/js/search-strategy.js`: interface (padrão Strategy).
- `src/js/ui.js`: camada de apresentação — manipula DOM e interage com o usuário.
- `src/js/metrics.js`: coleta, formata e modela resultados de busca (`SearchResult`).
- `src/js/telemetry.js`: inicialização OpenTelemetry (traces + métricas).
- `src/js/search-result.js`: modelo de retorno `SearchResult`.

Separação de responsabilidades
- Algoritmos: implementação pura dos algoritmos e gerador `stepByStep` para visualização.
- Serviço de execução/medição: `metrics.js` centraliza medição e criação de `SearchResult`.
- Observabilidade: `telemetry.js` é a única responsável por inicializar tracer/meter e expor helpers.
- UI: `ui.js` apenas orquestra a interação e apresenta resultados/visualizações.

Recomendações
- Evitar lógica de negócio na UI; mover medições ou benchmarking para um `searchService.js` se ampliar funcionalidades.
- Adicionar testes automatizados para cada estratégia e para o `metrics`.
- Padronizar retornos (ex.: sempre retornar instâncias de `SearchResult`).
