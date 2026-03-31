let iterator;

export function startStep(strategy, text, pattern) {
  iterator = strategy.stepByStep(text, pattern);
}

export function nextStep() {
  return iterator.next();
}