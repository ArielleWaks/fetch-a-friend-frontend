import { HttpError } from "../services/http";
import { getAuthFeedback } from "./authFeedback";

describe("getAuthFeedback", () => {
  it("uses custom action in 5xx copy", () => {
    const err = new HttpError("fail", { status: 503, data: {} });
    const fb = getAuthFeedback(err, { action: "complete sign-up" });
    expect(fb.soft).toBe(true);
    expect(fb.text).toContain("complete sign-up");
    expect(fb.text).toContain("try again");
  });

  it("401 with safe backend message returns hard feedback", () => {
    const err = new HttpError("nope", {
      status: 401,
      data: { message: "Invalid credentials" },
    });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(false);
    expect(fb.text).toBe("Invalid credentials");
  });

  it("401 without safe message uses generic copy", () => {
    const err = new HttpError("Unauthorized", {
      status: 401,
      data: { message: "internal server leak" },
    });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(false);
    expect(fb.text).toBe("Username or password doesn’t match our records.");
  });

  it("403 behaves like 401", () => {
    const err = new HttpError("Forbidden", {
      status: 403,
      data: { message: "Not allowed" },
    });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(false);
    expect(fb.text).toBe("Not allowed");
  });

  it("404 is soft", () => {
    const err = new HttpError("Not Found", { status: 404 });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(true);
    expect(fb.text).toMatch(/isn’t available/i);
  });

  it("429 is soft", () => {
    const err = new HttpError("Too Many", { status: 429 });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(true);
    expect(fb.text).toMatch(/Too many attempts/i);
  });

  it("4xx with safe message uses hard feedback", () => {
    const err = new HttpError("Bad", { status: 400, data: { message: "Bad request" } });
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(false);
    expect(fb.text).toBe("Bad request");
  });

  it("TypeError maps to connection copy", () => {
    const err = new TypeError("Failed to fetch");
    const fb = getAuthFeedback(err);
    expect(fb.soft).toBe(true);
    expect(fb.text).toMatch(/couldn’t reach the server/i);
  });

  it("generic error with gateway-like text is soft", () => {
    const fb = getAuthFeedback(new Error("502 Bad Gateway"));
    expect(fb.soft).toBe(true);
    expect(fb.text).toMatch(/trouble right now/i);
  });

  it("uses safe generic error message as hard feedback when message passes filters", () => {
    const fb = getAuthFeedback(new Error("something weird"));
    expect(fb.soft).toBe(false);
    expect(fb.text).toBe("something weird");
  });

  it("falls back to generic soft message when message is not client-safe", () => {
    const fb = getAuthFeedback(new Error("internal"));
    expect(fb.soft).toBe(true);
    expect(fb.text).toBe("Something went wrong. Please try again.");
  });
});
