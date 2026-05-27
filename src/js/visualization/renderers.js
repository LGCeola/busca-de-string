// Componentes de renderização visual da aplicação

const visualization = document.getElementById("visualization");
const textDisplay = document.getElementById("textDisplay");

export function log(message) {
  const p = document.createElement("p");
  p.textContent = message;
  visualization.appendChild(p);
  visualization.scrollTop = visualization.scrollHeight;
}

export function clearLog() {
  visualization.innerHTML = "";
}

export function renderMatches(text, pattern, matches) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const isMatch = matches.some(pos => i >= pos && i < pos + pattern.length);

    if (isMatch) {
      result += `<span class="highlight">${text[i]}</span>`;
    } else {
      result += text[i];
    }
  }

  textDisplay.innerHTML = result;
}

export function highlightStep(text, i, j, match) {
  let result = "";

  for (let index = 0; index < text.length; index++) {
    if (index === i + j) {
      const bgColor = match ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)";
      const borderColor = match ? "#10b981" : "#ef4444";
      result += `<span style="background:${bgColor}; border-bottom: 2px solid ${borderColor}; color:#ffffff; padding: 1px 3px; border-radius: 3px;">${text[index]}</span>`;
    } else {
      result += text[index];
    }
  }

  textDisplay.innerHTML = result;
}
