import { log, highlightStep } from "./renderers.js";

export function handleStep(step, text) {
  switch (step.type) {
    case "compare":
      log(`Comparando '${step.textChar}' com '${step.patternChar}'`);
      highlightStep(text, step.i, step.j, step.match);
      break;
    case "match":
      log(`Match encontrado na posição ${step.position}`);
      break;
    case "shift":
      log(`Shift de ${step.newI ?? step.newIndex ?? step.shift}`);
      break;
    case "jump":
      log(`Jump -> ${step.newJ ?? step.to}`);
      break;
    case "collision":
      log(`Colisão de hash`);
      break;
    case "hashCompare":
      log(`Hash comparado: ${step.textHash} | Padrão: ${step.patternHash}`);
      break;
    case "rehash":
      log(`Rehash -${step.removedChar} +${step.addedChar}`);
      break;
    default:
      console.warn("Tipo de passo desconhecido:", step);
  }
}