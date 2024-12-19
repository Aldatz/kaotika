import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateBCFA = (attributes: Modifier): number => {
	const { strength, insanity } = attributes;
	return strength + insanity;
}