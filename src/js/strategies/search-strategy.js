export default class SearchStrategy {
  search(text, pattern) {
    throw new Error('Método deve ser implementado por subclasses');
  }

  stepByStep(text, pattern) {
    throw new Error('Método deve ser implementado por subclasses');
  }
}