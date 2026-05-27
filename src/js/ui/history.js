export function addToHistory(searchResult, historyTableBody, currentText) {
  if (!historyTableBody) return;

  const emptyRow = historyTableBody.querySelector('.empty-row');
  if (emptyRow) {
    emptyRow.remove();
  }

  const row = document.createElement("tr");
  const algoLabel = searchResult.algorithm === 'naive' ? 'Naive' :
                    searchResult.algorithm === 'kmp' ? 'KMP' :
                    searchResult.algorithm === 'rabin-karp' ? 'Rabin-Karp' : 'Boyer-Moore';
  
  const textPreview = currentText.substring(0, 30) + (currentText.length > 30 ? '...' : '');

  row.innerHTML = `
    <td><span class="history-algo-badge ${searchResult.algorithm}">${algoLabel}</span></td>
    <td><strong>${searchResult.time.toFixed(4)}ms</strong></td>
    <td>${searchResult.comparisons}</td>
    <td>${searchResult.matches.length}</td>
    <td title="${currentText}">${textPreview}</td>
  `;

  historyTableBody.insertBefore(row, historyTableBody.firstChild);
}
