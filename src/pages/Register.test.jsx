import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => globalThis.__registerTestNavigate,
  };
});

vi.mock("../services/auth.service", () => ({
  default: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

vi.mock("react-validation/build/form", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef(({ children, onSubmit }, ref) => {
      React.useImperativeHandle(ref, () => ({
        validateAll: () => {},
      }));
      return <form onSubmit={onSubmit}>{children}</form>;
    }),
  };
}, { virtual: true });

vi.mock("react-validation/build/button", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        context: { _errors: [] },
      }));
      return (
        <button type="button" style={{ display: "none" }} ref={ref} {...props} />
      );
    }),
  };
}, { virtual: true });

vi.mock("react-validation/build/input", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef(({ validations, ...rest }, ref) => (
      <input ref={ref} id={rest.name} {...rest} />
    )),
  };
}, { virtual: true });

import AuthService from "../services/auth.service";
import Register from "./Register";

describe("Register", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    globalThis.__registerTestNavigate = mockNavigate;
    AuthService.register.mockReset();
    AuthService.login.mockReset();
  });

  async function fillValidFormAndSubmit() {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/username/i), "newuser");
    await user.type(screen.getByLabelText(/^email$/i), "new@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "secret12");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
  }

  it("calls sign-in after successful signup and navigates to profile", async () => {
    AuthService.register.mockResolvedValue({
      data: { message: "Registered successfully." },
    });
    AuthService.login.mockResolvedValue({
      accessToken: "token",
      username: "newuser",
      roles: ["ROLE_USER"],
    });

    await fillValidFormAndSubmit();

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith(
        "newuser",
        "new@example.com",
        "secret12"
      );
    });
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith("newuser", "secret12");
    });
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("shows a message when signup succeeds but sign-in fails", async () => {
    AuthService.register.mockResolvedValue({
      data: { message: "Registered successfully." },
    });
    AuthService.login.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    await fillValidFormAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/automatic sign-in failed/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/please sign in manually/i)
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
