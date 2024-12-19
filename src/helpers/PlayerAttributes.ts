import { Modifier } from "@/_common/interfaces/Modifier";
import { Player } from "@/_common/interfaces/Player";
import { CHARISMA, CONSTITUTION, DEXTERITY, INSANITY, INTELLIGENCE, STRENGTH } from "../constants/constants";

export const calculateAllAttributes = (player: Player, setCurrentAttributes: (attributes: Modifier) => void) => {
    if(player) {
    
        const equipmentModifiers: Modifier[] = [
        player.equipment.helmet?.modifiers,
        player.equipment.weapon?.modifiers,
        player.equipment.armor?.modifiers,
        player.equipment.shield?.modifiers,
        player.equipment.artifact?.modifiers,
        player.equipment.boot?.modifiers,
        player.equipment.ring?.modifiers,
        ].filter((modifier): modifier is Modifier => modifier !== undefined); // Filtra los undefined

        const calculateAttribute = (attribute: keyof Modifier): number => {
        const baseValue = player.attributes?.[attribute] || 0;
        const equipmentValue = equipmentModifiers.reduce((sum, modifier) => sum + (modifier[attribute] || 0), 0);
        return baseValue + equipmentValue;
        };

        const currentAttributes: Modifier = {
        charisma: calculateAttribute(CHARISMA),
        constitution: calculateAttribute(CONSTITUTION),
        dexterity: calculateAttribute(DEXTERITY),
        insanity: calculateAttribute(INSANITY),
        intelligence: calculateAttribute(INTELLIGENCE),
        strength: calculateAttribute(STRENGTH),
        };

        setCurrentAttributes(currentAttributes); 
    }
}