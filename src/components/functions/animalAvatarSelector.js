const animalAvatarSelector = (jobObject) =>{
    if (jobObject.chosenAnimalType === "Dog"){return "/favavatar.jpeg"}
    else if(jobObject.chosenAnimalType === "Cat"){return "/Cat-icon_30345.png"}
    else if(jobObject.chosenAnimalType === "Fish"){return "/fish_icon.png"}
    else if(jobObject.chosenAnimalType === "Bird"){return "/bird_icon.png"}
    else if(jobObject.chosenAnimalType === "Lizard"){return "/lizard_icon.png"}
    else if(jobObject.chosenAnimalType === "Hamster"){return "hamster.png"}
    else if(jobObject.chosenAnimalType === "Guinea Pig"){return "guinea-pig.png"}
    else if(jobObject.chosenAnimalType === "Rabbit"){return "bunny.png"}
    else if(jobObject.chosenAnimalType === "Turtle"){return "turtle.png"}
    else if(jobObject.chosenAnimalType === "Ferret"){return "ferret.png"}
    else if(jobObject.chosenAnimalType === "Mouse"){return "mouse.png"}
    else if(jobObject.chosenAnimalType === "Chinchilla"){return "chinchilla.png"}
  }

  export default animalAvatarSelector;