import { Modifier } from "@/_common/interfaces/Modifier";

export const calculateMagicResistance = (attributes: Modifier): number => {
	const { intelligence, charisma } = attributes;
	return intelligence + charisma;
}