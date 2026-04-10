import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import AuthService from "./services/auth.service";

jest.mock("./pages/BrowseJobs", () => {
  function MockBrowseJobs() {
    return <div>Browse Available Jobs</div>;
  }
  return MockBrowseJobs;
});

jest.mock("./services/auth.service", () => ({
  __esModule: true,
  default: {
    getCurrentUser: jest.fn(() => null),
    logout: jest.fn(),
  },
}));

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    AuthService.getCurrentUser.mockReturnValue(null);
  });

  function renderApp(initialEntries = ["/"]) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  }

  it("renders browse jobs on /", () => {
    renderApp(["/"]);
    expect(screen.getByText("Browse Available Jobs")).toBeInTheDocument();
  });

  it("renders login route", () => {
    renderApp(["/login"]);
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders register route", () => {
    renderApp(["/register"]);
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
  });
});
