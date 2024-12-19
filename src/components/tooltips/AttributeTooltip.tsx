import React from 'react';
import { Attribute } from '@/_common/interfaces/Attribute';

interface Props {
  element: Attribute;
}

const AttributeTooltip: React.FC<Props> = ({ element }) => {

    return (
        <div className='p-4 text-center'>
          <h1 className="text-3xl mb-2 text-darkSepia">{element.name}</h1>
          <p className="text-2xl mb-2">{element.description}</p>        
        </div>
    )

}

export default AttributeTooltip;