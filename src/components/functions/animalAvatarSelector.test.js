import animalAvatarSelector from "./animalAvatarSelector";

describe("animalAvatarSelector", () => {
  it.each([
    ["DOG", "/dog.png"],
    ["CAT", "/Cat-icon_30345.png"],
    ["FISH", "/fish_icon.png"],
    ["BIRD", "/bird_icon.png"],
    ["LIZARD", "/lizard_icon.png"],
    ["HAMSTER", "/hamster.png"],
    ["GUINEAPIG", "/guinea-pig.png"],
    ["RABBIT", "/bunny.png"],
    ["TURTLE", "/turtle.png"],
    ["FERRET", "/ferret.png"],
    ["MOUSE", "/mouse.png"],
    ["CHINCHILLA", "/chinchilla.png"],
  ])("maps %s to asset path", (petType, path) => {
    expect(animalAvatarSelector({ petType })).toBe(path);
  });

  it("returns undefined for unknown pet type", () => {
    expect(animalAvatarSelector({ petType: "UNKNOWN" })).toBeUndefined();
  });
});
