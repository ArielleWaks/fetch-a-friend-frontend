import { HttpError } from "../services/http";

/** @typedef {{ text: string, soft: boolean }} AuthFeedback */

const soft = (text) => ({ text, soft: true });
const hard = (text) => ({ text, soft: false });

/**
 * Maps API / network errors to safe copy and whether to show a loud (Alert) or quiet (text) UI.
 * @param {unknown} error
 * @param {{ action?: string }} [opts] action phrase, e.g. "sign you in" or "complete sign-up"
 * @returns {AuthFeedback}
 */
export function getAuthFeedback(error, opts = {}) {
  const action = opts.action || "sign you in";

  if (error instanceof HttpError) {
    const { status, data, message } = error;
    const backendMsg = (data && data.message) || message || "";

    if (status >= 500) {
      return soft(
        `We couldn’t ${action} right now. Please try again in a moment.`
      );
    }

    if (status === 401 || status === 403) {
      const safe = clientSafeMessage(backendMsg);
      if (safe) return hard(safe);
      return hard("Username or password doesn’t match our records.");
    }

    if (status === 404) {
      return soft("That isn’t available right now. Please try again later.");
    }

    if (status === 429) {
      return soft("Too many attempts. Please wait a bit and try again.");
    }

    const safe = clientSafeMessage(backendMsg);
    if (safe) return hard(safe);
    return soft("We couldn’t complete that. Please try again.");
  }

  if (error && error.name === "TypeError") {
    return soft(
      "We couldn’t reach the server. Check your connection and try again."
    );
  }

  const raw =
    (error && error.data && error.data.message) ||
    (error && error.message) ||
    String(error || "");

  if (/internal server error|502|503|504|bad gateway|service unavailable/i.test(raw)) {
    return soft("We’re having trouble right now. Please try again shortly.");
  }

  const safe = clientSafeMessage(raw);
  if (safe) return hard(safe);

  return soft("Something went wrong. Please try again.");
}

function clientSafeMessage(raw) {
  if (!raw || typeof raw !== "string") return "";
  const t = raw.trim();
  if (t.length > 160) return "";
  if (
    /internal|stack trace|exception|^sql |database |ECONN|timeout exceeded/i.test(
      t
    )
  ) {
    return "";
  }
  return t;
}
