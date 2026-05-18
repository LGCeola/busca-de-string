export default class SearchResult {
  constructor({ algorithm, matches, comparisons, time, textSize, patternSize, complexity }) {
    this.algorithm = algorithm;
    this.matches = matches;
    this.comparisons = comparisons;
    this.time = time;
    this.textSize = textSize;
    this.patternSize = patternSize;
    this.complexity = complexity;
  }
}
