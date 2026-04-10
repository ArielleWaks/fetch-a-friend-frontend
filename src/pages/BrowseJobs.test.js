import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BrowseJobs from "./BrowseJobs";

jest.mock("../components/JobCard", () => {
  function MockJobCard({ jobObject }) {
    return <div data-testid="job-card">{jobObject.id}</div>;
  }
  return MockJobCard;
});

describe("BrowseJobs", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 7,
            zipCode: 90210,
            petType: "DOG",
            usersWhoBookmarked: [],
          },
        ]),
    });
  });

  function renderBrowse() {
    return render(
      <MemoryRouter>
        <BrowseJobs />
      </MemoryRouter>
    );
  }

  it("loads open jobs and renders heading", async () => {
    renderBrowse();
    expect(await screen.findByText("Browse Available Jobs")).toBeInTheDocument();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/jobs/open",
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });
    expect(await screen.findByTestId("job-card")).toHaveTextContent("7");
  });

  it("shows login prompt when user is not logged in", async () => {
    localStorage.removeItem("user");
    renderBrowse();
    expect(await screen.findByText("Browse Available Jobs")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /login/i })
    ).toBeInTheDocument();
  });
});
