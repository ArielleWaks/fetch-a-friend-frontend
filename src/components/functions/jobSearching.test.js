import GetAnimalData from "./jobSearching";

describe("GetAnimalData", () => {
  it("returns unique chosenAnimalType values in order of first appearance", () => {
    const jobs = [
      { chosenAnimalType: "DOG" },
      { chosenAnimalType: "CAT" },
      { chosenAnimalType: "DOG" },
      { chosenAnimalType: "BIRD" },
    ];
    expect(GetAnimalData(jobs)).toEqual(["DOG", "CAT", "BIRD"]);
  });

  it("returns empty array for empty input", () => {
    expect(GetAnimalData([])).toEqual([]);
  });
});
