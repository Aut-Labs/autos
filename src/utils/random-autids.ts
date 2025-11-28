import { AutOSAutID } from "@api/models/aut.model";

const shuffleArray = (array: AutOSAutID[]) =>
  array.sort(() => 0.5 - Math.random());

const ensureSpecificItemCount = (array: AutOSAutID[], itemCount = 9) => {
  let tempArray = [...array];
  while (tempArray.length < itemCount) {
    tempArray = [...tempArray, ...array.slice(0, itemCount - tempArray.length)];
  }
  tempArray = shuffleArray(tempArray);

  return tempArray.slice(0, itemCount);
};

export const randomAutIDs = (array: AutOSAutID[], itemCount = 9) => {
  if (array.length === 0) {
    return [];
  }
  return ensureSpecificItemCount(array, itemCount);
};
