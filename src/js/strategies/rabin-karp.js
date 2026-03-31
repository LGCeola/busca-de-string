import SearchStrategy from "./search-strategy.js";

export default class RabinKarp extends SearchStrategy {
  search(text, pattern) {
    const base = 256;
    const mod = 101;

    const n = text.length;
    const m = pattern.length;

    let patternHash = 0;
    let textHash = 0;
    let h = 1;

    let comparisons = 0;
    let matches = [];

    // h = base^(m-1) % mod
    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % mod;
    }

    // hash incial
    for (let i = 0; i < m; i++) {
      patternHash = (base * patternHash + pattern.charCodeAt(i)) % mod;
      textHash = (base * textHash + text.charCodeAt(i)) % mod;
    }

    for (let i = 0; i <= n -m; i++) {
      if (patternHash === textHash) {
        let match = true;

        for (let j = 0; j < m; j++) {
          comparisons++;

          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          matches.push(i);
        }
      }

      if (i < n - m) {
        textHash = (
          base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)
        ) % mod;

        if (textHash < 0) textHash += mod;
      }
    }

    return { matches, comparisons };
  }

  *stepByStep(text, pattern) {
    const base = 256;
    const mod = 101;
    
    const n = text.length
    const m  = pattern.length;

    let patternHash = 0;
    let textHash = 0;
    let h = 1;

    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % mod;
    }

    for (let i = 0; i < m; i++) {
      patternHash = (base * patternHash + pattern.charCodeAt(i)) % mod;
      textHash = (base * textHash + text.charCodeAt(i)) % mod;
    }

    for (let i = 0; i <= n - m; i++) {
      yield {
        type: "hashCompare",
        index: i,
        patternHash,
        textHash
      };

      if (patternHash === textHash) {
        yield {
          type: "hashMatch",
          index: i,
        };

        let match = true;

        for (let j = 0; j < m; j++) {
          const isMatch = text[i + j] === pattern[j];
          yield {
            type: "compare",
            i,
            j,
            textChar: text[i + j],
            patternChar: pattern[j],
            match: isMatch
          };

          if (!isMatch) {
            match = false;

            yield {
              type: "collision",
              index: i,
            };

            break;
          }
        }

        if (match) {
          yield {
            type: "match",
            position: i
          };
        }
      }

      if (i < n - m) {
        const oldHash = textHash;
        textHash = (
          base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m) 
        ) % mod;

        if (textHash < 0) textHash += mod;

        yield {
          type: "refresh",
          oldHash,
          newHash: textHash,
          removedChar: text[i],
          addedChar: text[i + m]
        };

        yield {
          type: "shift",
          newI: i + 1
        }
      }
    }
  }
}