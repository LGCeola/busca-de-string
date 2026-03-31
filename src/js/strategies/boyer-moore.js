import SearchStrategy from "./search-strategy.js";

export default class BoyerMoore extends SearchStrategy {
  buildBadCharTable(pattern) {
    const table = {};

    for (let i = 0; i < pattern.length; i++) {
      table[pattern[i]] = i;
    }

    return table;
  }

  search(text, pattern) {
    const badChar = this.buildBadCharTable(pattern);

    let matches = [];
    let comparisons = 0;

    let i = 0;

    while (i <= text.length - pattern.lentgh) {
      let j = pattern.length - 1;

      while (j >= 0 && pattern[j] === text[i + j]) {
        comparisons++;
        j--;
      }

      if (j < 0) {
        matches.push(i);

        i += (i + pattern.length < text.length)
          ? pattern.length - (badChar[text[i + pattern.length]] ?? -1)
          : 1;
      } else {
        comparisons++;

        const shift = Math.max(
          1,
          j - (badChar[text[i + j]] ?? -1)
        );

        i += shift;
      }
    }

    return { matches, comparisons };
  }

  *stepByStep(text, pattern) {
    const badChar = this.buildBadCharTable(pattern);

    let i = 0;

    while (i <= text.length - pattern.length) {
      let j = pattern.length - 1;

      while (j >= 0) {
        const match = pattern[j] === text[i + j];

        yield {
          type: "compare",
          i,
          j,
          textChar: text[i + j],
          patternChar: pattern[j],
          match,
          badCharTable: badChar
        };

        if (!match) break;

        j--;
      }

      if (j < 0) {
        yield {
          type: "match",
          position: i
        };

        const nextChar = text[i + pattern.length];

        const shift = (nextChar)
          ? pattern.length - (badChar[nextChar] ?? -1)
          : 1;

        yield {
          type: "shift",
          shift,
          reason: "match completo"
        };

        i += shift;

      } else {
        const badCharIndex = badChar[text[i + j]] ?? -1;
        const shift = Math.max(1, j - badCharIndex);

        yield {
          type: "shift",
          shift,
          reason: `bad char '${text[i + j]}'`
        };

        i += shift;
      }
    }
  }
}