Telemetria (OpenTelemetry)

O que foi implementado
- `src/js/telemetry.js` inicializa um `WebTracerProvider` e um `MeterProvider`.
- Exportadores de console foram configurados para spans e métricas (ConsoleSpanExporter / ConsoleMetricExporter).
- Métricas criadas:
  - `search.executions.count` (counter)
  - `search.duration.ms` (histogram)
  - `search.comparisons.count` (counter)
  - `search.matches.count` (counter)
- Spans: cada execução cria um span `search.execution` com atributos: `algorithm`, `textSize`, `patternSize`, e atributos adicionais preenchidos ao final da execução (`search.matches`, `search.comparisons`, `search.duration_ms`).

Como observar localmente
- No navegador, a instrumentação atualmente exporta para o console. Abra as DevTools e filtre por `OTEL` ou observe os `console.log` do exporter.

Como enviar para um backend
- Recomenda-se configurar um exportador OTLP (OTLP/HTTP) e apontar para um collector ou backend (e.g., Grafana Tempo / Prometheus + OTLP -> Tempo).
- Exemplo (pseudocódigo):
  - substituir `ConsoleSpanExporter` por `OTLPTraceExporter` e configurar `endpoint`.
  - usar um `OTLPMetricExporter` para métricas e configurar `MetricReader`.

Próximos passos
- Adicionar configuração via variáveis de ambiente (endpoint, sampling rate).
- Criar um dashboard (Grafana/Loki/Tempo) ou um painel no frontend que consuma as métricas em memória.
- Persistir execuções em um storage local (IndexedDB) para análise histórica no dashboard.
