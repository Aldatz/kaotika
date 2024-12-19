import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateCFP = (attributes: Modifier):  number => {
  const {insanity} = attributes;
	return insanity;
}