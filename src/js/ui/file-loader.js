export function setupFileUploader(uploadInputSelector, textInputElement, telemetryLogger) {
  const uploadInput = document.querySelector(uploadInputSelector);
  if (!uploadInput || !textInputElement) return;

  uploadInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    textInputElement.value = "";

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        const content = loadEvent.target.result;
        textInputElement.value += content;

        if (typeof telemetryLogger === "function") {
          telemetryLogger("file.uploaded", { name: file.name, sizeBytes: file.size });
        }
      };

      reader.readAsText(file);
    });
  });
}
