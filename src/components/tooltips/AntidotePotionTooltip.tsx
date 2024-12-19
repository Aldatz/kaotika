import React from 'react';
import { AntidotePotion } from '@/_common/interfaces/AntidotePotion';

interface Props {
  element: AntidotePotion;
  equiped: AntidotePotion | null;
}

const AntidotePotionTooltip: React.FC<Props> = ({ element, equiped }): React.ReactNode => {
  return (
    <div key={element._id} className='w-full p-4 text-center'>
      <div className="flex flex-row justify-items-center items-center">
        <div className="p-4">
          <h1 className="text-3xl mb-2 text-darkSepia">{element.name}</h1>
          <p className="text-2xl mb-2 font-light">{element.description}</p>
          <p className="text-3xl mb-2 text-darkSepia">Recovery {element.recovery_effect.type}</p>         
          <p className="text-2xl mb-2 ">{element.recovery_effect.name}</p> 
        </div>
        {equiped 
        ?
        <div className="p-4">
          <h1 className="text-3xl mb-2 text-orange-500">{equiped.name}</h1>
          <p className="text-2xl mb-2 font-light">{equiped.description}</p>
          <p className="text-3xl mb-2 text-darkSepia">Recovery {equiped.recovery_effect.type}</p>         
          <p className="text-2xl mb-2 ">{equiped.recovery_effect.name}</p> 
        </div>
        : null } 
      </div>       
    </div>
  )
}

export default AntidotePotionTooltip