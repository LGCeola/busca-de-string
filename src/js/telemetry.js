import { DiagConsoleLogger, DiagLogLevel, diag, trace } from "https://esm.sh/@opentelemetry/api@1.4.1";
import { WebTracerProvider } from "https://esm.sh/@opentelemetry/sdk-trace-web@1.9.1";
import { ConsoleSpanExporter, SimpleSpanProcessor } from "https://esm.sh/@opentelemetry/sdk-trace-base@1.9.1";
import { MeterProvider, ConsoleMetricExporter, PeriodicExportingMetricReader } from "https://esm.sh/@opentelemetry/sdk-metrics@1.29.0";

let tracer;
let meter;
let searchExecutionCounter;
let searchDurationHistogram;
let comparisonCounter;
let matchCounter;

export function initializeTelemetry() {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  const tracerProvider = new WebTracerProvider();
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  tracerProvider.register();

  tracer = trace.getTracer("busca-de-string", "1.0.0");

  const meterProvider = new MeterProvider();
  meterProvider.addMetricReader(
    new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
      exportIntervalMillis: 5000
    })
  );

  meter = meterProvider.getMeter("busca-de-string", "1.0.0");

  searchExecutionCounter = meter.createCounter("search.executions.count", {
    description: "Número de buscas executadas"
  });

  searchDurationHistogram = meter.createHistogram("search.duration.ms", {
    description: "Duração de buscas em milissegundos"
  });

  comparisonCounter = meter.createCounter("search.comparisons.count", {
    description: "Número de comparações realizadas durante a busca"
  });

  matchCounter = meter.createCounter("search.matches.count", {
    description: "Número de correspondências encontradas"
  });

  logTelemetry("telemetry.initialized", { source: "browser" });
}

export function createSearchSpan(algorithm, textSize, patternSize) {
  if (!tracer) {
    return {
      setAttribute: () => {},
      end: () => {},
      recordException: () => {}
    };
  }

  const span = tracer.startSpan("search.execution", {
    attributes: {
      algorithm,
      textSize,
      patternSize
    }
  });

  return span;
}

export function recordSearchMetrics({ algorithm, matches, comparisons, time }) {
  if (!meter) return;

  const labels = { algorithm };
  searchExecutionCounter.add(1, labels);
  searchDurationHistogram.record(time, labels);
  comparisonCounter.add(comparisons, labels);
  matchCounter.add(matches, labels);
}

export function logTelemetry(event, attributes = {}) {
  diag.debug(`[OTEL] ${event}`, attributes);
}
