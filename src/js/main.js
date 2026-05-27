import NaiveSearch from "./strategies/naive-search.js";
import RabinKarp from "./strategies/rabin-karp.js";
import KMP from "./strategies/kmp.js";
import BoyerMoore from "./strategies/boyer-moore.js";
import SearchResult from "./search-result.js";
import { getComplexity } from "./metrics.js";

let currentStrategy;
let currentStrategyType;

export function setStrategy(type) {
  currentStrategyType = type;
  switch (type) {
    case "naive":
      currentStrategy = new NaiveSearch();
      break;
    case "rabin-karp":
      currentStrategy = new RabinKarp();
      break;
    case "kmp": 
      currentStrategy = new KMP();
      break;
    case "boyer-moore":
      currentStrategy = new BoyerMoore();
      break;
    default:
      throw new Error("[ERROR]Estratégia desconhecida.");
  }

  return currentStrategy;
}

export function run(text, pattern) {
  if (!currentStrategy) {
    throw new Error("Nenhuma estratégia de busca selecionada.");
  }

  const start = performance.now();
  const result = currentStrategy.search(text, pattern);
  const end = performance.now();

  return new SearchResult({
    algorithm: currentStrategyType,
    matches: result.matches,
    comparisons: result.comparisons,
    time: Number((end - start).toFixed(4)),
    textSize: text.length,
    patternSize: pattern.length,
    complexity: getComplexity(currentStrategyType)
  });
}