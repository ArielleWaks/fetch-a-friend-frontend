const animalAvatarSelector = (jobObject) =>{
    if (jobObject.petType === "DOG"){return "/favavatar.jpeg"}
    else if(jobObject.petType === "CAT"){return "/Cat-icon_30345.png"}
    else if(jobObject.petType === "FISH"){return "/fish_icon.png"}
    else if(jobObject.petType === "BIRD"){return "/bird_icon.png"}
    else if(jobObject.petType === "LIZARD"){return "/lizard_icon.png"}
    else if(jobObject.petType === "HAMSTER"){return "hamster.png"}
    else if(jobObject.petType === "GUINEAPIG"){return "guinea-pig.png"}
    else if(jobObject.petType === "RABBIT"){return "bunny.png"}
    else if(jobObject.petType === "TURTLE"){return "turtle.png"}
    else if(jobObject.petType === "FERRET"){return "ferret.png"}
    else if(jobObject.petType === "MOUSE"){return "mouse.png"}
    else if(jobObject.petType === "CHINCHILLA"){return "chinchilla.png"}
  }

  export default animalAvatarSelector;