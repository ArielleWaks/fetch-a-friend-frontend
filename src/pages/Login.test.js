import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import AuthService from "../services/auth.service";
import { HttpError } from "../services/http";

jest.mock("../services/auth.service", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login", () => {
  beforeEach(() => {
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
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getAllByText("This field is required!").length).toBeGreaterThanOrEqual(2);
  });

  it("calls AuthService.login and navigates on success", async () => {
    AuthService.login.mockResolvedValue({ accessToken: "t" });
    renderLogin();
    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/password/i), "secret12");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith("alice", "secret12");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows soft feedback for server errors", async () => {
    AuthService.login.mockRejectedValue(new HttpError("fail", { status: 503 }));
    renderLogin();
    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/password/i), "secret12");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      await screen.findByText(/couldn’t sign you in right now/i)
    ).toBeInTheDocument();
  });
});
