async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export class HttpError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

/**
 * @param {string} url
 * @param {RequestInit & { headers?: Record<string, string> }} options
 */
export async function request(url, options = {}) {
  const { headers: hdrs = {}, body, method = "GET", ...rest } = options;
  const headers = { ...hdrs };

  let outBody = body;
  if (
    body != null &&
    typeof body === "object" &&
    !(body instanceof FormData)
  ) {
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    outBody = JSON.stringify(body);
  }

  const res = await fetch(url, { ...rest, method, headers, body: outBody });
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const msg =
      (data && data.message) || res.statusText || "Request failed";
    throw new HttpError(msg, { status: res.status, data });
  }

  return data;
}

export function getJson(url, headers = {}) {
  return request(url, { method: "GET", headers });
}

export function postJson(url, body, headers = {}) {
  return request(url, { method: "POST", body, headers });
}
