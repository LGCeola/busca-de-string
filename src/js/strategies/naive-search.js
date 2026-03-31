import SearchStrategy from "./search-strategy.js";

export default class NaiveSearch extends SearchStrategy {
  search(text, pattern) {
    let comparisons = 0;
    let matches = [];

    for (let i = 0; i <= text.length - pattern.length; i++) {
      let j = 0;

      while (j < pattern.length && text[i + j] === pattern[j]) {
        comparisons++;
        j++;
      }

      if (j === pattern.length) {
        matches.push(i);
      }
    }

    return { matches, comparisons };
  }

  *stepByStep(text, pattern) {
    for (let i = 0; i <= text.length - pattern.length; i++) {
      for (let j = 0; j < pattern.length; j++) {

        const match = text[i + j] === pattern[j];
        yield {
          type: "compare",
          i,
          j,
          textChar: text[i + j],
          patternChar: pattern[j],
          match
        };

        if (!match) break;

        if (j === pattern.length) {
          yield {
            type: "match",
            position: i
          };
        }

        yield {
          type: "shift",
          newI: i + 1
        };
      }
    }

    return;
  }
}