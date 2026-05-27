// src/js/ui.js
import { setStrategy, run } from "./main.js";
import { initializeTelemetry, createSearchSpan, recordSearchMetrics, logTelemetry } from "./telemetry.js";
import { setupFileUploader } from "./ui/file-loader.js";
import { setupTelemetryConsole } from "./ui/telemetry-ui.js";
import { addToHistory } from "./ui/history.js";

// Novos Módulos Isolados
import { initCharts, updateChartData } from "./ui/charts.js";
import { log, clearLog, renderMatches } from "./visualization/renderers.js";
import { handleStep } from "./visualization/step-handler.js";

let currentStrategy = null;
let stepIndicator = null;

// Inicialização de infraestrutura
initializeTelemetry();
initCharts();
setupTelemetryConsole(document.getElementById("otelLogDisplay"));
setupFileUploader("#uploadTxt", document.getElementById("textInput"), logTelemetry);

// Elementos DOM
const textInput = document.getElementById("textInput");
const patternInput = document.getElementById("patternInput");
const algorithmSelect = document.getElementById("algorithmSelect");
const nextStepBtn = document.getElementById("nextStepBtn");

const getStrategy = () => currentStrategy = setStrategy(algorithmSelect.value);

function updateMetricsUI(res) {
  document.getElementById("time").textContent = `${res.time.toFixed(4)}ms`;
  document.getElementById("comparisons").textContent = res.comparisons;
  document.getElementById("textSize").textContent = res.textSize;
  document.getElementById("patternSize").textContent = res.patternSize;
  document.getElementById("complexity").textContent = res.complexity;
}

// Evento: Executar Único
document.getElementById("runBtn").addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;
  const algo = algorithmSelect.value;

  if (!text || !pattern) return alert("Por favor, insira o texto e o padrão.");

  clearLog();
  getStrategy();
  const span = createSearchSpan(algo, text.length, pattern.length);

  try {
    const result = run(text, pattern);
    
    recordSearchMetrics({ algorithm: algo, matches: result.matches.length, comparisons: result.comparisons, time: result.time });
    span.setAttributes({ "search.matches": result.matches.length, "search.comparisons": result.comparisons, "search.duration_ms": result.time });

    updateMetricsUI(result);
    renderMatches(text, pattern, result.matches);
    updateChartData(algo, result.time, result.comparisons);
    addToHistory(result);

    log(`Execução concluída. ${result.matches.length} correspondências encontradas.`);
    logTelemetry("search.completed", { algorithm: algo, durationMs: result.time, comparisons: result.comparisons, matches: result.matches.length });
  } catch (error) {
    span.recordException(error);
    logTelemetry("search.error", { algorithm: algo, error: error.message });
    log(`Erro: ${error.message}`);
  } finally {
    span.end();
  }
});

// Evento: Comparar Todos
document.getElementById("compareAllBtn").addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;
  if (!text || !pattern) return alert("Por favor, insira o texto e o padrão.");

  clearLog();
  log("Iniciando comparação de desempenho entre todos os algoritmos...");

  const algorithms = ["naive", "kmp", "rabin-karp", "boyer-moore"];
  let results = {};

  algorithms.forEach(algo => {
    setStrategy(algo);
    const span = createSearchSpan(algo, text.length, pattern.length);

    try {
      const result = run(text, pattern);
      results[algo] = result;

      recordSearchMetrics({ algorithm: algo, matches: result.matches.length, comparisons: result.comparisons, time: result.time });
      span.setAttributes({ "search.matches": result.matches.length, "search.comparisons": result.comparisons, "search.duration_ms": result.time });

      updateChartData(algo, result.time, result.comparisons);
      addToHistory(result);
      log(`[${algo.toUpperCase()}] Tempo: ${result.time.toFixed(4)}ms | Comparações: ${result.comparisons}`);
    } catch (error) {
      span.recordException(error);
      log(`[${algo.toUpperCase()}] Erro: ${error.message}`);
    } finally {
      span.end();
    }
  });

  const currentAlgo = algorithmSelect.value;
  if (results[currentAlgo]) {
    updateMetricsUI(results[currentAlgo]);
    renderMatches(text, pattern, results[currentAlgo].matches);
  }
  log("Comparação concluída!");
});

// Eventos: Modo Passo a Passo
document.getElementById("stepBtn").addEventListener("click", () => {
  if (!textInput.value || !patternInput.value) return alert("Por favor, insira o texto e o padrão.");
  
  getStrategy();
  stepIndicator = currentStrategy.stepByStep(textInput.value, patternInput.value);
  clearLog();
  log("Modo passo a passo iniciado...");
  nextStepBtn.disabled = false;
});

nextStepBtn.addEventListener("click", () => {
  if (!stepIndicator) return;
  const step = stepIndicator.next();

  if (step.done) {
    log("Execução passo a passo finalizada.");
    stepIndicator = null;
    nextStepBtn.disabled = true;
    return;
  }

  handleStep(step.value, textInput.value);
});