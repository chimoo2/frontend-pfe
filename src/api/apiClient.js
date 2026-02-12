export const BASE_URL = "http://localhost:8080";

export async function apiClient(path, options = {}) {
  const token = localStorage.getItem("authToken");

  const headers = {
    ...(options.headers || {}),
  };

  // ❗ Ne PAS forcer Content-Type si FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 🔥 NE PAS rediriger ici
  if (res.status === 401) {
    localStorage.removeItem("authToken");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text || "Request failed");
    err.status = res.status;
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}
