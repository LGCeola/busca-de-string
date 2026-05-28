# Relatório de Uso de IA — Assistência Automatizada

## Acadêmicos
- Francisco Marcelo Caetano Costa
- Lucas Grimes Ceola

## Resumo do uso de IA no projeto
A IA foi utilizada como ferramenta de apoio durante o desenvolvimento do projeto, auxiliando principalmente com sugestões técnicas, esclarecimento de dúvidas e apoio na organização da arquitetura da aplicação.

O desenvolvimento, integração, testes e validaações finais foram realizados manualmente.

## Atividades apoiadas pela IA
- Sugestões para instrumentação com OpenTelemetry no frontend.
- Apoio na organização da estrutura do projeto.
- Sugestões de implementação para a estrutura `SearchResult`.
- Auxílio na organização das métricas e integração com a interface.
- Apoio na documentação e estruturação do relatório de uso de IA.

## Arquivos relacionados às implementações
- `src/js/telemetry.js`
- `src/js/search-result.js`
- `src/js/metrics.js`
- `src/js/ui.js`
- `package.json`

## Dependências e versões utilizadas
- `@opentelemetry/api` ^1.4.0
- `@opentelemetry/sdk-trace-web` ^1.9.1
- `@opentelemetry/sdk-trace-base` ^1.9.1
- `@opentelemetry/sdk-metrics` ^1.29.0

## Decisões e intervenções manuais
- Resolução manual de conflitos de dependências utilizando `--legacy-peer-deps`.
- Configuração manual do ambiente ESM com `type: "module"` no `package.json`.
- Ajustes realizados manualmente na interface e no dashboard.
- Revisão e adaptação das sugestões fornecidas pela IA para atender aos requisitos da atividade.

## Comandos executados localmente
- `npm init -y`
- `npm install ... --legacy-peer-deps`

## Considerações finais
O uso da IA contribuiu como suporte técnico e consultivo durante o desenvolvimento, auxiliando na produtividade e entendimento das ferramentas utilizadas, sem substituir a implementação e validaação realizadas manualmente.
