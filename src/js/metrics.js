export function measureExecution(strategy, text, pattern) {
  const start = performance.now();
  const result = strategy.search(text, pattern);
  const end = performance.now();

  return {
    ...result,
    time: end - start
  };
}

export function getComplexity(algorithm) {
  const algorithms = {
    naive: "O(n * m)",
    rk: "O(n + m) (médio)",
    kmp: "O(n + m)",
    bm: "O(n / m) (melhor caso)"
  };

  const complexities = {
    naive: algorithms.naive,
    "rabin-karp": algorithms.rk,
    kmp: algorithms.kmp,
    "boyer-moore": algorithms.bm
  };

  return complexities[algorithm] || "Complexidade desconhecida";
}

export function formatMetrics(result, text, pattern, algorithm) {
  return {
    time: result.time.toFixed(4),
    comparisons: result.comparisons,
    matches: result.matches.length,
    textSize: text.length,
    patternSize: pattern.length,
    complexity: getComplexity(algorithm)
  };
}

export function compareResults(results) {
  return results.sort((a, b) => a.time - b.time);
}