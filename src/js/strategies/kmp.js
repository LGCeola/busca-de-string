import SearchStrategy from "./search-strategy";

export default class KMP extends SearchStrategy {
  // LPS : Longest Prefix Suffix
  buildLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);

    let length = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else {
        if (length !== 0) {
          length = lps[length - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  search(text, pattern) {
    const lps = this.buildLPS(pattern);

    let i = 0;
    let j =0;

    let matches = [];
    let comparisons = 0;

    while (i < text.length) {
      comparisons++;

      if (pattern[j] === text[i]) {
        i++;
        j++;
      }
    }
  }

  *stepByStep(text, pattern) {
    const lps = this.buildLPS(pattern);

    let i = 0;
    let j = 0;

    while (i < text.length) {
      const match = pattern[j] === text[i];

      yield {
        type: "compare",
        i,
        j,
        textChar: text[i],
        patternChar: pattern[j],
        match,
        lps
      };

      if (match) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        yield {
          type: "match",
          position: i -j
        };

        j = lps[j - 1];
        yield {
          type: "jump",
          newJ: j,
          reason: "Uso da LPS após match"
        };
      }

      else if (i < text.length && !match) {
        if (j !== 0) {
          const oldJ = j;
          j = lps[j - 1];

          yield {
            type: "jump",
            from: oldJ,
            to: j,
            reason: "Uso da LPS evita recomparação"
          };
        } else {
          i++;

          yield {
            type: "shift",
            newI: i
          };
        }
      }
    }
  }
}