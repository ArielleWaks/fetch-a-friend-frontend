import bookmarkUpdate from "./bookmarkUpdate";

describe("bookmarkUpdate", () => {
  const API_URL = "/api";
  const jobObject = { id: 42 };

  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  it("on 401 clears user and navigates to login", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ accessToken: "tok", id: 1 })
    );
    const navigate = jest.fn();
    global.fetch.mockResolvedValue({ status: 401, statusText: "Unauthorized" });

    await bookmarkUpdate(jobObject, API_URL, navigate);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/jobs/bookmark/42`,
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
          "Content-Type": "application/json",
        }),
      })
    );
    expect(localStorage.getItem("user")).toBeNull();
    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("on non-401 logs error", async () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "tok" }));
    const navigate = jest.fn();
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch.mockResolvedValue({ status: 500, statusText: "Server Error" });

    await bookmarkUpdate(jobObject, API_URL, navigate);

    expect(navigate).not.toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it("on fetch rejection logs error", async () => {
    localStorage.setItem("user", JSON.stringify({ accessToken: "tok" }));
    const navigate = jest.fn();
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch.mockRejectedValue(new Error("network"));

    await bookmarkUpdate(jobObject, API_URL, navigate);

    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
