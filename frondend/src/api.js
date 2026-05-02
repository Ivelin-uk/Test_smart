const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function parseError(response) {
  const fallback = "Request failed.";

  try {
    const body = await response.json();
    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (typeof body?.error === "string" && body.error.trim()) {
      return body.error;
    }
    if (typeof body?.detail === "string" && body.detail.trim()) {
      return body.detail;
    }
  } catch (error) {
    // Ignore JSON parsing failures and return generic text below.
  }

  return fallback;
}

export async function postAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
