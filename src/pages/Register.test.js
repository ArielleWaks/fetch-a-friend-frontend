import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";
import AuthService from "../services/auth.service";
import { HttpError } from "../services/http";

jest.mock("../services/auth.service", () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
  },
}));

describe("Register", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    AuthService.register.mockReset();
  });

  function renderRegister() {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  }

  it("shows username length validation after submit", async () => {
    renderRegister();
    await user.type(screen.getByLabelText(/username/i), "ab");
    await user.type(screen.getByLabelText(/email/i), "a@b.co");
    const [passwordInput, confirmInput] = screen.getAllByLabelText(/password/i);
    await user.type(passwordInput, "secret1");
    await user.type(confirmInput, "secret1");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(
      await screen.findByText(/username must be between 3 and 20/i)
    ).toBeInTheDocument();
  });

  it("shows success alert when register resolves", async () => {
    AuthService.register.mockResolvedValue({
      data: { message: "Registration OK" },
    });
    renderRegister();
    await user.type(screen.getByLabelText(/username/i), "alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    const [pw1, pw2] = screen.getAllByLabelText(/password/i);
    await user.type(pw1, "secret1");
    await user.type(pw2, "secret1");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith(
        "alice",
        "alice@example.com",
        "secret1"
      );
      expect(screen.getByRole("alert")).toHaveTextContent("Registration OK");
    });
  });

  it("shows soft server message in typography for 5xx", async () => {
    AuthService.register.mockRejectedValue(new HttpError("x", { status: 502 }));
    renderRegister();
    await user.type(screen.getByLabelText(/username/i), "alice");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    const [pwa, pwb] = screen.getAllByLabelText(/password/i);
    await user.type(pwa, "secret1");
    await user.type(pwb, "secret1");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/couldn’t complete sign-up right now/i)
      ).toBeInTheDocument();
    });
  });
});
