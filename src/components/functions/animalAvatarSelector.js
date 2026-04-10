const animalAvatarSelector = (jobObject) => {
  if (jobObject.petType === "DOG") {
    return "/dog.png";
  }
  if (jobObject.petType === "CAT") {
    return "/Cat-icon_30345.png";
  }
  if (jobObject.petType === "FISH") {
    return "/fish_icon.png";
  }
  if (jobObject.petType === "BIRD") {
    return "/bird_icon.png";
  }
  if (jobObject.petType === "LIZARD") {
    return "/lizard_icon.png";
  }
  if (jobObject.petType === "HAMSTER") {
    return "/hamster.png";
  }
  if (jobObject.petType === "GUINEAPIG") {
    return "/guinea-pig.png";
  }
  if (jobObject.petType === "RABBIT") {
    return "/bunny.png";
  }
  if (jobObject.petType === "TURTLE") {
    return "/turtle.png";
  }
  if (jobObject.petType === "FERRET") {
    return "/ferret.png";
  }
  if (jobObject.petType === "MOUSE") {
    return "/mouse.png";
  }
  if (jobObject.petType === "CHINCHILLA") {
    return "/chinchilla.png";
  }
};

export default animalAvatarSelector;
