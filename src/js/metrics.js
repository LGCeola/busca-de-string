import SearchResult from "./search-result.js";

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
    "rabin-karp": "O(n + m) (médio)",
    kmp: "O(n + m)",
    "boyer-moore": "O(n / m) (melhor caso)"
  };

  return algorithms[algorithm] || "Complexidade desconhecida";
}

export function createSearchResult(result, text, pattern, algorithm) {
  return new SearchResult({
    algorithm,
    matches: result.matches,
    comparisons: result.comparisons,
    time: Number(result.time.toFixed(4)),
    textSize: text.length,
    patternSize: pattern.length,
    complexity: getComplexity(algorithm)
  });
}

export function formatMetrics(searchResult) {
  return {
    time: `${searchResult.time.toFixed(4)}ms`,
    comparisons: searchResult.comparisons,
    matches: searchResult.matches.length,
    textSize: searchResult.textSize,
    patternSize: searchResult.patternSize,
    complexity: searchResult.complexity
  };
}

export function compareResults(results) {
  return results.sort((a, b) => a.time - b.time);
}
