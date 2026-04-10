import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AppProviders } from "@/app/providers";
import App from "@/App";

describe("App", () => {
  it("renders app shell", () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>
    );
    const banner = screen.getByRole("banner");
    expect(within(banner).getByText("Fetch a Friend")).toBeInTheDocument();
  });
});
