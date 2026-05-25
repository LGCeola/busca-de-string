import { setStrategy, run } from "./main.js";
import { formatMetrics } from "./metrics.js";
import { initializeTelemetry, createSearchSpan, recordSearchMetrics, logTelemetry, subscribeTelemetryLogs } from "./telemetry.js";

let currentStrategy = null;
let stepIndicator = null;

// Inicializa a Telemetria
initializeTelemetry();

// Elementos DOM
const textInput = document.getElementById("textInput");
const patternInput = document.getElementById("patternInput");
const algorithmSelect = document.getElementById("algorithmSelect");

const runBtn = document.getElementById("runBtn");
const compareAllBtn = document.getElementById("compareAllBtn");
const stepBtn = document.getElementById("stepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");

const visualization = document.getElementById("visualization");
const textDisplay = document.getElementById("textDisplay");
const historyTableBody = document.getElementById("historyTableBody");
const otelLogDisplay = document.getElementById("otelLogDisplay");

// Instâncias de Gráficos
let timeChartInstance = null;
let compChartInstance = null;

// Inicializar Gráficos e Telemetria
initCharts();
setupTelemetryConsole();

// Event Listeners
runBtn.addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;
  const algorithm = algorithmSelect.value;

  if (!text || !pattern) {
    alert("Por favor, insira o texto e o padrão a ser buscado.");
    return;
  }

  clearLog();
  getStrategy();

  const span = createSearchSpan(algorithm, text.length, pattern.length);

  try {
    const searchResult = run(text, pattern);
    const metrics = formatMetrics(searchResult);

    recordSearchMetrics({
      algorithm,
      matches: searchResult.matches.length,
      comparisons: searchResult.comparisons,
      time: searchResult.time
    });

    span.setAttribute("search.matches", searchResult.matches.length);
    span.setAttribute("search.comparisons", searchResult.comparisons);
    span.setAttribute("search.duration_ms", searchResult.time);

    updateMetricsUI(searchResult);
    renderMatches(text, pattern, searchResult.matches);
    
    // Atualiza Gráficos e Histórico
    updateChartData(algorithm, searchResult.time, searchResult.comparisons);
    addToHistory(searchResult);

    log(`Execução concluída. ${searchResult.matches.length} correspondências encontradas.`);
    logTelemetry("search.completed", {
      algorithm,
      durationMs: searchResult.time,
      comparisons: searchResult.comparisons,
      matches: searchResult.matches.length
    });
  } catch (error) {
    span.recordException(error);
    logTelemetry("search.error", {
      algorithm,
      error: error.message
    });
    log(`Erro: ${error.message}`);
    throw error;
  } finally {
    span.end();
  }
});

compareAllBtn.addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;

  if (!text || !pattern) {
    alert("Por favor, insira o texto e o padrão a ser buscado.");
    return;
  }

  clearLog();
  log("Iniciando comparação de desempenho entre todos os algoritmos...");

  const algorithms = ["naive", "kmp", "rabin-karp", "boyer-moore"];
  let results = {};

  algorithms.forEach(algo => {
    setStrategy(algo);
    const span = createSearchSpan(algo, text.length, pattern.length);

    try {
      const searchResult = run(text, pattern);
      results[algo] = searchResult;

      recordSearchMetrics({
        algorithm: algo,
        matches: searchResult.matches.length,
        comparisons: searchResult.comparisons,
        time: searchResult.time
      });

      span.setAttribute("search.matches", searchResult.matches.length);
      span.setAttribute("search.comparisons", searchResult.comparisons);
      span.setAttribute("search.duration_ms", searchResult.time);

      updateChartData(algo, searchResult.time, searchResult.comparisons);
      addToHistory(searchResult);

      log(`[${algo.toUpperCase()}] Tempo: ${searchResult.time.toFixed(4)}ms | Comparações: ${searchResult.comparisons} | Matches: ${searchResult.matches.length}`);
    } catch (error) {
      span.recordException(error);
      logTelemetry("search.error", { algorithm: algo, error: error.message });
      log(`[${algo.toUpperCase()}] Erro: ${error.message}`);
    } finally {
      span.end();
    }
  });

  // Mostrar destaque da busca com o algoritmo atual no select
  const currentAlgo = algorithmSelect.value;
  if (results[currentAlgo]) {
    updateMetricsUI(results[currentAlgo]);
    renderMatches(text, pattern, results[currentAlgo].matches);
  }
  log("Comparação concluída! Verifique o painel gráfico abaixo.");
});

stepBtn.addEventListener("click", () => {
  const text = textInput.value;
  const pattern = patternInput.value;

  if (!text || !pattern) {
    alert("Por favor, insira o texto e o padrão a ser buscado.");
    return;
  }

  getStrategy();

  stepIndicator = currentStrategy.stepByStep(text, pattern);

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

  handleStep(step.value);
});


// Funções Auxiliares
function getStrategy() {
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

function updateMetricsUI(searchResult) {
  document.getElementById("time").textContent = `${searchResult.time.toFixed(4)}ms`;
  document.getElementById("comparisons").textContent = searchResult.comparisons;
  document.getElementById("textSize").textContent = searchResult.textSize;
  document.getElementById("patternSize").textContent = searchResult.patternSize;
  document.getElementById("complexity").textContent = searchResult.complexity;
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
      result += `<span style="background:${match ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}; border-bottom: 2px solid ${match ? "#10b981" : "#ef4444"}; color:#ffffff; padding: 1px 3px; border-radius: 3px;">${text[index]}</span>`;
    } else {
      result += text[index];
    }
  }

  textDisplay.innerHTML = result;
}

// Upload de arquivo TXT
document.getElementById('uploadTxt').addEventListener('change', function(e) {
  const files = e.target.files;
  const textArea = document.getElementById('textInput');
  
  textArea.value = "";

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = function(event) {
      const content = event.target.result;
      textArea.value += content;
      logTelemetry("file.uploaded", { name: file.name, sizeBytes: file.size });
    };

    reader.readAsText(file);
  });
});

// Inicialização de Gráficos com Chart.js
function initCharts() {
  const ctxTime = document.getElementById('timeChart').getContext('2d');
  const ctxComp = document.getElementById('compChart').getContext('2d');

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  timeChartInstance = new Chart(ctxTime, {
    type: 'bar',
    data: {
      labels: ['Naive', 'KMP', 'Rabin-Karp', 'Boyer-Moore'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: commonOptions
  });

  compChartInstance = new Chart(ctxComp, {
    type: 'bar',
    data: {
      labels: ['Naive', 'KMP', 'Rabin-Karp', 'Boyer-Moore'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: commonOptions
  });
}

function updateChartData(algorithm, time, comparisons) {
  const indexMap = {
    'naive': 0,
    'kmp': 1,
    'rabin-karp': 2,
    'boyer-moore': 3
  };

  const idx = indexMap[algorithm];
  if (idx !== undefined) {
    timeChartInstance.data.datasets[0].data[idx] = Number(time.toFixed(4));
    compChartInstance.data.datasets[0].data[idx] = comparisons;
    timeChartInstance.update();
    compChartInstance.update();
  }
}

// Histórico de Execuções
function addToHistory(searchResult) {
  const emptyRow = historyTableBody.querySelector('.empty-row');
  if (emptyRow) {
    emptyRow.remove();
  }

  const row = document.createElement("tr");
  const algoClass = searchResult.algorithm;
  const algoLabel = searchResult.algorithm === 'naive' ? 'Naive' :
                    searchResult.algorithm === 'kmp' ? 'KMP' :
                    searchResult.algorithm === 'rabin-karp' ? 'Rabin-Karp' : 'Boyer-Moore';
  
  const textPreview = textInput.value.substring(0, 30) + (textInput.value.length > 30 ? '...' : '');

  row.innerHTML = `
    <td><span class="history-algo-badge ${algoClass}">${algoLabel}</span></td>
    <td><strong>${searchResult.time.toFixed(4)}ms</strong></td>
    <td>${searchResult.comparisons}</td>
    <td>${searchResult.matches.length}</td>
    <td title="${textInput.value}">${textPreview}</td>
  `;

  historyTableBody.insertBefore(row, historyTableBody.firstChild);
}

// Console de Telemetria Dinâmico (OpenTelemetry)
function setupTelemetryConsole() {
  otelLogDisplay.innerHTML = `<span class="telemetry-comment">// Observabilidade ativada. Aguardando execuções...</span>`;

  subscribeTelemetryLogs((event, attributes) => {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = "telemetry-line";

    let tagClass = "otel";
    if (event.startsWith("span")) tagClass = "trace";
    if (event.startsWith("metrics")) tagClass = "metric";

    line.innerHTML = `
      <div>
        <span class="telemetry-time">[${timestamp}]</span>
        <span class="telemetry-tag ${tagClass}">${event.toUpperCase()}</span>
        <span style="word-break: break-all;">${JSON.stringify(attributes)}</span>
      </div>
    `;

    otelLogDisplay.appendChild(line);
    otelLogDisplay.scrollTop = otelLogDisplay.scrollHeight;
    
    // Limitar logs exibidos em tela para evitar lentidão
    if (otelLogDisplay.childNodes.length > 50) {
      otelLogDisplay.removeChild(otelLogDisplay.firstChild);
    }
  });
}