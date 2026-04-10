import { beforeEach, describe, expect, it, vi } from "vitest";
import { paths } from "@/api/paths";
import AuthService from "./auth.service";

vi.mock("@/api/client", () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from "@/api/client";

describe("AuthService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("register posts signup payload and wraps response", async () => {
    api.post.mockResolvedValue({ data: { message: "Registered" } });
    const out = await AuthService.register("u1", "u1@x.com", "pw123456");
    expect(api.post).toHaveBeenCalledWith(paths.auth.signup, {
      username: "u1",
      email: "u1@x.com",
      password: "pw123456",
    });
    expect(out).toEqual({ data: { message: "Registered" } });
  });

  it("login posts signin and persists user when accessToken present", async () => {
    const payload = { accessToken: "tok", username: "u1" };
    api.post.mockResolvedValue({ data: payload });
    const data = await AuthService.login("u1", "secret12");
    expect(api.post).toHaveBeenCalledWith(paths.auth.signin, {
      username: "u1",
      password: "secret12",
    });
    expect(data).toEqual(payload);
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(payload);
  });

  it("login does not write localStorage without accessToken", async () => {
    api.post.mockResolvedValue({ data: { username: "u1" } });
    await AuthService.login("u1", "p");
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("logout clears user", () => {
    localStorage.setItem("user", "{}");
    AuthService.logout();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("getCurrentUser reads from localStorage", () => {
    const u = { accessToken: "a" };
    localStorage.setItem("user", JSON.stringify(u));
    expect(AuthService.getCurrentUser()).toEqual(u);
  });
});
