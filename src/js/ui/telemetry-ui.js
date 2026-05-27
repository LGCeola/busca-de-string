import { subscribeTelemetryLogs } from "../telemetry.js";

export function setupTelemetryConsole(otelLogDisplay) {
  if (!otelLogDisplay) return;

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

    if (otelLogDisplay.childNodes.length > 50) {
      otelLogDisplay.removeChild(otelLogDisplay.firstChild);
    }
  });
}
