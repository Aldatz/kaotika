import React from 'react';
import { useDroppable } from '@dnd-kit/core';


interface Props {
  id: number;
  type: string;
  children: React.ReactNode;
}

const Droppable: React.FC<Props> = ({ id, type, children }) => {
  const {setNodeRef} = useDroppable({
    id: id,
    data: {
      type: type,
    },
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Droppable;