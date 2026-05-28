# Busca de String

Projeto desenvolvido para análise, comparação e monitoramento de algoritmos de busca, aplicando boas práticas de engenharia de software e observabilidade com OpenTelemetry.

---

## Acadêmicos
- Francisco Marcelo Caetano Costa
- Lucas Grimes Ceola

---

## Objetivo

O objetivo deste projeto é implementar algoritmos de busca e analisar seu comportamento utilizando métricas, traces e logs, permitindo comparações entre desempenho teórico e prático.

Além disso, o projeto aplica conceitos de:

- Organização e arquitetura de software
- Separação de responsabilidades
- Padrão de projeto Strategy
- Observabilidade
- Monitoramento de execução

---

## Tecnologias Utilizadas

- JavaScript
- Node.js
- OpenTelemetry
- HTML/CSS

---

## Funcionalidades

- Execução de algoritmos de busca
- Comparação de desempenho
- Coleta de métricas
- Geração de traces
- Registro de logs
- Dashboard para monitoramento

---

## Estrutura do Projeto

```txt
src/
 ┣ js/
 ┃ ┣ telemetry.js
 ┃ ┣ metrics.js
 ┃ ┣ search-result.js
 ┃ ┗ ui.js
docs/
 ┣ architecture.md
 ┣ telemetry.md
 ┗ ai-usage-report.md
```

---

## Como Executar o Projeto

### Instalar dependências

```bash
npm install
```

### Executar o projeto

```bash
npm start
```

---

## Observabilidade

O projeto utiliza OpenTelemetry para monitoramento da aplicação através de:

- Traces
- Métricas
- Logs

As informações coletadas permitem analisar:

- Tempo de execução dos algoritmos
- Quantidade de execuções
- Comparações de desempenho
- Comportamento da aplicação em tempo real

---

## Documentação

- Arquitetura: [docs/architecture.md](docs/architecture.md)
- Telemetria: [docs/telemetry.md](docs/telemetry.md)
- Relatório de uso de IA: [docs/ai-usage-report.md](docs/ai-usage-report.md)

---

## Padrões e Boas Práticas

- Padrão Strategy
- Separação de responsabilidades
- Código modularizado
- Estrutura padronizada de retorno (`SearchResult`)


