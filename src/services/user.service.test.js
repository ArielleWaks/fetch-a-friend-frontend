import { beforeEach, describe, expect, it, vi } from "vitest";
import { paths } from "@/api/paths";
import UserService from "./user.service";

vi.mock("@/api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from "@/api/client";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(
      "user",
      JSON.stringify({ accessToken: "tok" })
    );
  });

  it("getPublicContent calls api.get with auth header", async () => {
    api.get.mockResolvedValue({ data: { roles: ["ROLE_USER"] } });
    await expect(UserService.getPublicContent()).resolves.toEqual({
      roles: ["ROLE_USER"],
    });
    expect(api.get).toHaveBeenCalledWith(paths.user.all, {
      headers: { Authorization: "Bearer tok" },
    });
  });

  it("getImageContent calls file upload path with auth header", async () => {
    api.get.mockResolvedValue({ data: [] });
    await expect(UserService.getImageContent()).resolves.toEqual([]);
    expect(api.get).toHaveBeenCalledWith("/file/upload", {
      headers: { Authorization: "Bearer tok" },
    });
  });
});
