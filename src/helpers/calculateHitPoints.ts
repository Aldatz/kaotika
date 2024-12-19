import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateHitPoints = (attributes: Modifier): number => {
  const { constitution, dexterity, insanity } = attributes;
  return constitution + dexterity - insanity / 2;
};