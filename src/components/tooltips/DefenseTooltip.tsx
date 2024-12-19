import React from 'react';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Armor } from '@/_common/interfaces/Armor';
import { Shield } from '@/_common/interfaces/Shield';
import { Boot } from '@/_common/interfaces/Boot';

interface Props {
  element: Helmet | Armor | Shield | Boot;
  equiped: Helmet | Armor | Shield | Boot | null;
}

const DefenseTooltip: React.FC<Props> = ({ element, equiped }): React.ReactNode => {
  return (
    <div key={element._id} className='w-full p-4 text-center'>
      <div className="flex flex-row justify-items-center items-center">
      {equiped 
        ?
        <div className="w-full p-4">
          <h1 className={`text-3xl mb-2 ${equiped.isUnique ? "text-purple-500" : "text-darkSepia"}`}>{equiped.name}</h1>
          <p className="text-2xl mb-2">{equiped.description}</p>
          <h1 className="text-2xl mb-2 text-darkSepia">Min Level: <span className="text-2xl mb-2 text-yellow-200">{equiped.min_lvl}</span></h1>
          <h1 className="text-2xl mb-2 text-darkSepia">Defense: <span className={equiped.defense > element.defense ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>{equiped.defense }</span></h1>
          <h1 className="text-2xl mb-2 text-darkSepia">Value: <span className="text-2xl mb-2 text-yellow-200">{equiped.value}</span></h1>
          {Object.values(equiped.modifiers).some(el => el!= 0)? <h1 className="text-2xl mb-2 text-medievalSepia">Modifiers</h1>: null}
          {equiped.modifiers.constitution ? <p className={equiped.modifiers.constitution > element.modifiers.constitution ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Constitution: {equiped.modifiers.constitution}</p> : null}
          {equiped.modifiers.charisma ? <p className={equiped.modifiers.charisma > element.modifiers.charisma ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Charisma: {equiped.modifiers.charisma}</p> : null}
          {equiped.modifiers.dexterity ? <p className={equiped.modifiers.dexterity > element.modifiers.dexterity ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Dexterity: {equiped.modifiers.dexterity}</p> : null}
          {equiped.modifiers.insanity ? <p className={equiped.modifiers.insanity > element.modifiers.insanity ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Insanity: {equiped.modifiers.insanity}</p> : null}
          {equiped.modifiers.intelligence ? <p className={equiped.modifiers.intelligence > element.modifiers.intelligence ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Intelligence: {equiped.modifiers.intelligence}</p> : null}
          {equiped.modifiers.strength ? <p className={equiped.modifiers.strength > element.modifiers.strength ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Strength: {equiped.modifiers.strength}</p> : null} 
        </div>
        : null } 
        <div className="w-full p-4">
          <h1 className={`text-3xl mb-2 ${element.isUnique ? "text-purple-500" : "text-darkSepia"}`}>{element.name}</h1>
          <p className="text-2xl mb-2">{element.description}</p>
          <h1 className="text-2xl mb-2 text-darkSepia">Min Level: <span className="text-2xl mb-2 text-yellow-500">{element.min_lvl}</span></h1>
          <h1 className="text-2xl mb-2 text-darkSepia">Defense: <span className="text-2xl mb-2 text-yellow-500">{element.defense}</span></h1>
          <h1 className="text-2xl mb-2 text-darkSepia">Value: <span className="text-2xl mb-2 text-yellow-500">{element.value}</span></h1>
          {Object.values(element.modifiers).some(el => el!= 0)? <h1 className="text-2xl mb-2 text-medievalSepia">Modifiers</h1>: null}
          {element.modifiers.constitution ? <p className="text-2xl mb-2 text-darkSepia">Constitution: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.constitution}</span></p> :null}
          {element.modifiers.charisma ? <p className="text-2xl mb-2 text-darkSepia">Charisma: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.charisma}</span></p> : null}
          {element.modifiers.dexterity ? <p className="text-2xl mb-2 text-darkSepia">Dexterity: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.dexterity}</span></p> : null}
          {element.modifiers.insanity ? <p className="text-2xl mb-2 text-darkSepia">Insanity: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.insanity}</span></p> : null}
          {element.modifiers.intelligence ? <p className="text-2xl mb-2 text-darkSepia">Intelligence: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.intelligence}</span></p> : null}
          {element.modifiers.strength ? <p className="text-2xl mb-2 text-darkSepia">Strength: <span className="text-2xl mb-2 text-yellow-500">{element.modifiers.strength}</span></p> : null} 
        </div>
        
      </div>       
    </div>
  )
}

export default DefenseTooltip;