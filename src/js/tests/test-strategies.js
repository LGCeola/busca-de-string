// test-strategies.js
import fs from 'fs';
import path from 'path';

// Importe suas estratégias reais
import NaiveSearch from '../strategies/naive-search.js';
import KMPSearch from '../strategies/kmp.js';
import RabinKarpSearch from '../strategies/rabin-karp.js';
import BoyerMooreSearch from '../strategies/boyer-moore.js';

// Instancia as estratégias
const strategies = {
  'Naive': new NaiveSearch(),
  'KMP': new KMPSearch(),
  'Rabin-Karp': new RabinKarpSearch(),
  'Boyer-Moore': new BoyerMooreSearch()
};

// Auxiliar para carregar os arquivos da sua pasta data
function loadTestData(filename) {
  try {
    // Voltamos 2 níveis a partir da pasta 'tests': 
    // 1º vai para 'js' -> 2º vai para 'src' -> entra em 'data'
    const filePath = path.join(__dirname, '../../data', filename);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.warn(`Aviso: Não foi possível ler o arquivo ${filename}.`);
    return null;
  }
}

// 1. Cenários de Teste (Arquivos Reais e Casos Críticos)

const testSuites = [
  {
    name: "Caso Geral (Texto Real do arquivo data/teste1-naive.txt)",
    text: loadTestData('teste1-naive.txt') || "O algoritmo naive ou força bruta realiza um casamento de padrões simples.",
    pattern: "algoritmo",
    expectedMatches: null // Será validado por consistência entre todos eles
  },
  {
    name: "Pior Caso para Naive (Estresse de Comparações)",
    // Texto massivo: 50.000 'A's seguidos de um 'B'
    text: "A".repeat(50000) + "B", 
    pattern: "A".repeat(10) + "B", // "AAAAAAAAAAB"
    expectedMatches: [50000 - 10] // Deve achar exatamente no final
  },
  {
    name: "Melhor Caso para Boyer-Moore (Saltos Longos)",
    text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(2000), // 52.000 caracteres variados
    pattern: "XYZ",
    expectedMatches: null
  },
  {
    name: "Padrão Inexistente (Varredura Completa)",
    text: loadTestData('teste3-kmp.txt') || "Texto longo para testar falhas de casamento.",
    pattern: "ZQX79W",
    expectedMatches: []
  }
];

// 2. Execução dos Testes e Comparação Teórica vs. Prática

console.log("=== INICIANDO BENCHMARK E VALIDAÇÃO DE CORRETUDE ===\n");

testSuites.forEach((suite, index) => {
  console.log(`--------------------------------------------------`);
  console.log(`PROVA ${index + 1}: ${suite.name}`);
  console.log(`Tamanho do Texto (N): ${suite.text.length} | Tamanho do Padrão (M): ${suite.pattern.length}`);
  console.log(`--------------------------------------------------`);

  let baselineMatches = null;
  let summary = [];

  Object.entries(strategies).forEach(([name, strategy]) => {
    // Força o Garbage Collector a dar uma folga antes de medir tempo se necessário
    const startTime = performance.now();
    
    // Executa a sua assinatura de método (ajuste caso o método mude de nome)
    const result = strategy.search ? strategy.search(suite.text, suite.pattern) : strategy.run(suite.text, suite.pattern);
    
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Validação de Corretude (Todos os algoritmos DEVEM achar os mesmos índices)
    const matchesKey = JSON.stringify(result.matches);
    if (baselineMatches === null) {
      baselineMatches = matchesKey;
    } else if (baselineMatches !== matchesKey) {
      console.error(`❌ ERRO DE CORRETUDE: O algoritmo [${name}] divergiu dos outros!`);
      console.error(`Esperado (índices): ${baselineMatches} | Obtido: ${matchesKey}`);
    }

    if (suite.expectedMatches && JSON.stringify(result.matches) !== JSON.stringify(suite.expectedMatches)) {
      console.error(`❌ ERRO: Resultado não bate com o gabarito fixo do teste.`);
    }

    summary.push({
      Algoritmo: name,
      'Matches': result.matches.length,
      'Comparações (Prática)': result.comparisons,
      'Tempo (ms)': Number(duration.toFixed(4))
    });
  });

  console.table(summary);
});
