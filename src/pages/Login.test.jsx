import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import AuthService from "../services/auth.service";
import { HttpError } from "../services/http";

vi.mock("../services/auth.service", () => ({
  __esModule: true,
  default: {
    login: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockNavigate.mockClear();
    AuthService.login.mockReset();
  });

  function renderLogin() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  it("shows validation when submitting empty form", async () => {
    renderLogin();
    await user.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getAllByText("This field is required!").length).toBeGreaterThanOrEqual(2);
  });

  it("calls AuthService.login and navigates on success", async () => {
    AuthService.login.mockResolvedValue({ accessToken: "t" });
    renderLogin();
    await user.type(screen.getByLabelText(/username/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "secret12");
    await user.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith("alice", "secret12");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows soft feedback for server errors", async () => {
    AuthService.login.mockRejectedValue(new HttpError("fail", { status: 503 }));
    renderLogin();
    await user.type(screen.getByLabelText(/username/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "secret12");
    await user.click(screen.getByRole("button", { name: /login/i }));
    expect(
      await screen.findByText(/couldn’t sign you in right now/i)
    ).toBeInTheDocument();
  });
});
