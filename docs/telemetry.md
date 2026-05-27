# Telemetria (OpenTelemetry)

## Visão Geral

O projeto utiliza OpenTelemetry para instrumentação e monitoramento da aplicação, permitindo coletar informações sobre execução dos algoritmos, desempenho e comportamento da aplicação em tempo real.

A implementação foi realizada no frontend utilizando métricas e traces para análise das execuções dos algoritmos de busca.

---

## Implementação

O arquivo responsável pela configuração da telemetria é:

```txt
src/js/telemetry.js
```

Nesse módulo são inicializados:

- `WebTracerProvider`
- `MeterProvider`

Também foram configurados exportadores de console para facilitar visualização e testes durante o desenvolvimento:

- `ConsoleSpanExporter`
- `ConsoleMetricExporter`

---

## Métricas Implementadas

### `search.executions.count`

Counter responsável por contabilizar a quantidade de execuções realizadas pelos algoritmos de busca.

---

### `search.duration.ms`

Histogram utilizado para medir o tempo de execução de cada algoritmo.

---

### `search.comparisons.count`

Counter responsável por registrar o número de comparações realizadas durante a execução da busca.

---

### `search.matches.count`

Counter utilizado para contabilizar quantas ocorrências do padrão foram encontradas.

---

## Traces

Cada execução de algoritmo gera um span chamado:

```txt
search.execution
```

Os spans armazenam informações importantes sobre a execução da busca.

### Atributos registrados

- `algorithm`
- `textSize`
- `patternSize`
- `search.matches`
- `search.comparisons`
- `search.duration_ms`

Esses dados permitem acompanhar o comportamento dos algoritmos e comparar desempenho entre diferentes estratégias de busca.

---

## Objetivo da Instrumentação

A utilização do OpenTelemetry permite:

- Monitorar desempenho dos algoritmos
- Comparar execuções
- Analisar comportamento da aplicação
- Registrar métricas e traces em tempo real
- Facilitar futuras integrações com ferramentas de observabilidade

---

## Resultado

Com a instrumentação implementada, o sistema passa a fornecer informações detalhadas sobre cada execução dos algoritmos, auxiliando na análise prática de desempenho e no estudo de observabilidade em aplicações web.
