# Arquitetura do Sistema

## Projeto: Busca de Strings

---

## Estrutura Principal

```txt
src/js/
 ┣ strategies/
 ┃ ┣ boyer-moore.js
 ┃ ┣ kmp.js
 ┃ ┣ naive-search.js
 ┃ ┣ rabin-karp.js
 ┃ ┗ search-strategy.js
 ┣ visualization/
 ┣ main.js
 ┣ metrics.js
 ┣ search-result.js
 ┣ telemetry.js
 ┗ ui.js

---

## Componentes da Aplicação

### `strategies/`

Contém as implementações dos algoritmos de busca:

- Naive Search
- KMP (Knuth-Morris-Pratt)
- Rabin-Karp
- Boyer-Moore

Cada algoritmo possui sua própria implementação seguindo o padrão Strategy, permitindo fácil extensão e manutenção.

Além da execução da busca, os algoritmos também fornecem visualização passo a passo da execução.

---

### `search-strategy.js`

Define a interface base utilizada pelas estratégias de busca.

Responsabilidades:
- Padronizar a implementação dos algoritmos
- Permitir troca dinâmica de estratégias
- Facilitar reutilização e extensibilidade

---

### `metrics.js`

Responsável pela coleta e organização das métricas de execução.

Funções principais:
- Medição de tempo de execução
- Contagem de operações
- Geração de resultados padronizados
- Criação de objetos `SearchResult`

---

### `search-result.js`

Define a estrutura de retorno utilizada pela aplicação.

O modelo `SearchResult` centraliza os dados retornados pelos algoritmos, garantindo padronização entre resultados e facilitando integração com a interface e monitoramento.

---

### `telemetry.js`

Responsável pela inicialização da observabilidade utilizando OpenTelemetry.

Funcionalidades:
- Configuração de traces
- Configuração de métricas
- Exportação de dados de telemetria
- Integração com monitoramento

---

### `ui.js`

Camada responsável pela interface e interação com o usuário.

Responsabilidades:
- Manipulação do DOM
- Execução dos algoritmos selecionados
- Exibição de métricas e resultados
- Renderização das visualizações passo a passo

---

## Separação de Responsabilidades

A arquitetura do projeto foi organizada visando desacoplamento e reutilização dos componentes.

### Algoritmos
Responsáveis apenas pela lógica de busca e geração das etapas de execução.

### Serviço de Métricas
Centraliza medição de desempenho e padronização dos resultados.

### Observabilidade
Isola toda configuração relacionada ao OpenTelemetry em um único módulo.

### Interface
Responsável exclusivamente pela interação com o usuário e apresentação visual.

---

## Padrões e Boas Práticas Utilizadas

- Padrão Strategy
- Separação de responsabilidades
- Modularização
- Código reutilizável
- Estrutura padronizada de retorno
- Observabilidade com OpenTelemetry
