export default function GetAnimalData(jobData){
    const animalSelections = [];

  for (let i = 0; i < jobData.length; i++){
    if ((!animalSelections.includes(jobData[i].chosenAnimalType))){
    animalSelections.push(jobData[i].chosenAnimalType);}}

    return animalSelections;
}