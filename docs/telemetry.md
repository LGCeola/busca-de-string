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
