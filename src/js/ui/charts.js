let timeChartInstance = null;
let compChartInstance = null;

const indexMap = {
  'naive': 0,
  'kmp': 1,
  'rabin-karp': 2,
  'boyer-moore': 3
};

export function initCharts() {
  const ctxTime = document.getElementById('timeChart')?.getContext('2d');
  const ctxComp = document.getElementById('compChart')?.getContext('2d');
  if (!ctxTime || !ctxComp) return;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  const colors = {
    bg: ['rgba(99, 102, 241, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(139, 92, 246, 0.5)'],
    border: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
  };

  timeChartInstance = new Chart(ctxTime, {
    type: 'bar',
    data: { labels: ['Naive', 'KMP', 'Rabin-Karp', 'Boyer-Moore'], datasets: [{ data: [0, 0, 0, 0], backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1.5, borderRadius: 6 }] },
    options: commonOptions
  });

  compChartInstance = new Chart(ctxComp, {
    type: 'bar',
    data: { labels: ['Naive', 'KMP', 'Rabin-Karp', 'Boyer-Moore'], datasets: [{ data: [0, 0, 0, 0], backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1.5, borderRadius: 6 }] },
    options: commonOptions
  });
}

export function updateChartData(algorithm, time, comparisons) {
  const idx = indexMap[algorithm];
  if (idx !== undefined) {
    timeChartInstance.data.datasets[0].data[idx] = Number(time.toFixed(4));
    compChartInstance.data.datasets[0].data[idx] = comparisons;
    timeChartInstance.update();
    compChartInstance.update();
  }
}