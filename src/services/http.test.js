import { HttpError, request, getJson, postJson } from "./http";

function mockResponse(overrides) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => "",
    json: async () => ({}),
    ...overrides,
  };
}

describe("HttpError", () => {
  it("carries status and data", () => {
    const err = new HttpError("msg", { status: 422, data: { field: "x" } });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("HttpError");
    expect(err.status).toBe(422);
    expect(err.data).toEqual({ field: "x" });
  });
});

describe("request", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns parsed JSON on success", async () => {
    global.fetch.mockResolvedValue(
      mockResponse({
        text: async () => '{"a":1}',
      })
    );
    await expect(request("/api/x")).resolves.toEqual({ a: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("throws HttpError when response is not ok", async () => {
    global.fetch.mockResolvedValue(
      mockResponse({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => '{"message":"nope"}',
      })
    );
    await expect(request("/api/x")).rejects.toMatchObject({
      name: "HttpError",
      status: 400,
      message: "nope",
    });
  });

  it("stringifies object body and sets Content-Type", async () => {
    global.fetch.mockResolvedValue(mockResponse({ text: async () => "{}" }));
    await request("/api/x", {
      method: "POST",
      body: { foo: "bar" },
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({
        method: "POST",
        body: '{"foo":"bar"}',
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });
});

describe("getJson and postJson", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue(
      mockResponse({ text: async () => "null" })
    );
  });

  it("getJson uses GET", async () => {
    await getJson("/z", { Authorization: "Bearer t" });
    expect(global.fetch).toHaveBeenCalledWith(
      "/z",
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer t" },
      })
    );
  });

  it("postJson uses POST with body", async () => {
    await postJson("/z", { k: 1 });
    expect(global.fetch).toHaveBeenCalledWith(
      "/z",
      expect.objectContaining({
        method: "POST",
        body: '{"k":1}',
      })
    );
  });
});
