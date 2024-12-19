import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateAttack = (attributes: Modifier): number => {
	const { strength, insanity } = attributes;
	return strength - insanity/2;
}