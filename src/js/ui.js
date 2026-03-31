import { setStrategy } from "./main.js";
import { measureExecution, formatMetrics } from "./metrics.js";

let currentStrategy = null;
let stepIndicator = null;

const textInput = document.getElementById("textInput");
const patternInput = document.getElementById("patternInput");
const algorithmSelect = document.getElementById("algorithmSelect");

const runBtn = document.getElementById("runBtn");
const stepBtn = document.getElementById("stepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");

const visualization = document.getElementById("visualization");
const textDisplay = document.getElementById("textDisplay");

runBtn.addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;
  const algorithm = algorithmSelect.value;

  clearLog();
  getStrategy();

  const raw = measureExecution(currentStrategy, text, pattern);
  const metrics = formatMetrics(raw, text, pattern, algorithm);

  updateMetrics(metrics);
  renderMatches(text, pattern, raw.matches);

  log(`Execução finalizada. ${raw.matches.length} matches encontrados.`);
});

stepBtn.addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;

  getStrategy();

  stepIndicator = currentStrategy.stepByStep(text, pattern);

  clearLog();
  log("Modo passo a passo iniciado...");
});

nextStepBtn.addEventListener("click", () => {
  if (!stepIndicator) return;

  const step = stepIndicator.next();

  if (step.done) {
    log("Execução finalizada.");
    stepIndicator = null;
    return;
  }

  handleStep(step.value);
});


// Funções auxiliares
function getStrategy () {
  const type = algorithmSelect.value;
  currentStrategy = setStrategy(type);
}

function handleStep(step) {
  switch (step.type) {
    case "compare":
      log(`Comparando '${step.textChar}' com '${step.patternChar}'`);
      highlight(step.i, step.j, step.match);
      break;

    case "match":
      log(`Match encontrado na posição ${step.position}`);
      break;

    case "shift":
      log(`Shift de ${step.newI}`);
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
  }
}

function updateMetrics(metrics) {
  document.getElementById("time").textContent = metrics.time + "ms";
  document.getElementById("comparisons").textContent = metrics.comparisons;
  document.getElementById("textSize").textContent = metrics.textSize;
  document.getElementById("patternSize").textContent = metrics.patternSize;
  document.getElementById("complexity").textContent = metrics.complexity;
}

function log(message) {
  const p = document.createElement("p");
  p.textContent = message;
  visualization.appendChild(p);
  visualization.scrollTop = visualization.scrollHeight;
}

function clearLog() {
  visualization.innerHTML = "";
}

function renderMatches(text, pattern, matches) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    let isMatch = matches.some(pos => i >= pos && i < pos + pattern.length);

    if (isMatch) {
      result += `<span class="highlight">${text[i]}</span>`;
    } else {
      result += text[i];
    }
  }

  textDisplay.innerHTML = result;
}

function highlight(i, j, match) {
  const text = textInput.value;

  let result = "";

  for (let index = 0; index < text.length; index++) {
    if (index === i + j) {
      result += `<span style="background:${match ? "green" : "red"}; color:white;">${text[index]}</span>`;
    } else {
      result += text[index];
    }
  }

  textDisplay.innerHTML = result;
}

// Função de upload
document.getElementById('uploadTxt').addEventListener('change', function(e) {
  const files = e.target.files;
  const textArea = document.getElementById('textInput');
  
  textArea.value = "";

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = function(event) {
      const content = event.target.result;

      textArea.value += content;
    };

    reader.readAsText(file);
  });
});