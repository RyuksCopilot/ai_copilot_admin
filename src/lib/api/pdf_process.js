export async function uploadPdf(file) {
  if (!file) {
    throw new Error("PDF file is required");
  }

  const formData = new FormData();
  formData.append("file", file); // key MUST be "file"

  const response = await fetch("/api/v1/upload", {
    method: "POST",
    headers: {
      Accept: "application/json",
      // DO NOT set Content-Type manually
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return await response.json();
}