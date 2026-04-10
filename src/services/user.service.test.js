import { getJson } from "./http";
import UserService from "./user.service";

jest.mock("./http", () => ({
  getJson: jest.fn(),
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(
      "user",
      JSON.stringify({ accessToken: "tok" })
    );
  });

  it("getPublicContent calls getJson with auth header", async () => {
    getJson.mockResolvedValue({ roles: ["ROLE_USER"] });
    await expect(UserService.getPublicContent()).resolves.toEqual({
      roles: ["ROLE_USER"],
    });
    expect(getJson).toHaveBeenCalledWith("/api/user/all", {
      Authorization: "Bearer tok",
    });
  });

  it("getImageContent calls file upload path with auth header", async () => {
    getJson.mockResolvedValue([]);
    await expect(UserService.getImageContent()).resolves.toEqual([]);
    expect(getJson).toHaveBeenCalledWith("/file/upload", {
      Authorization: "Bearer tok",
    });
  });
});
