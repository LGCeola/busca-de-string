let currentStrategy;

export function setStrategy(type) {
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
  const start = performance.now();

  const result = currentStrategy.search(text, pattern);

  const end = performance.now();

  return {
    ...result,
    time: end - start
  };
}