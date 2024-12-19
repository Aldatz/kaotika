import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateDefense = (attributes: Modifier): number => {
    const {dexterity, constitution, intelligence} = attributes;
    return dexterity + constitution + intelligence/2;
  }