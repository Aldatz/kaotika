import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import { Armor } from '@/_common/interfaces/Armor';
import { Tooltip } from '@nextui-org/react';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Weapon } from '@/_common/interfaces/Weapon';
import { Shield } from '@/_common/interfaces/Shield';
import { Boot } from '@/_common/interfaces/Boot';
import { Ring } from '@/_common/interfaces/Ring';
import { Artifact } from '@/_common/interfaces/Artifact';
import { HealingPotion } from '@/_common/interfaces/HealingPotion';
import { AntidotePotion } from '@/_common/interfaces/AntidotePotion';
import { EnhancerPotion } from '@/_common/interfaces/EnhancerPotion';

type TooltipPlacement =
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

interface Props {
  id: string;
  tooltip: ReactNode;
  type: string[];
  element: Armor | Helmet | Weapon | Shield | Boot | Ring | Artifact | HealingPotion | AntidotePotion | EnhancerPotion;
  className: string | undefined;
  tooltipClassName: string;
  width: string;
  border: string;
  position: TooltipPlacement;
}

const Draggable: React.FC<Props> = ({ id, tooltip, type, tooltipClassName, className, width, border, element, position}) => {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
    data: {
      supports: type,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    width,
    border
  };

  return (
    <Tooltip className={tooltipClassName} placement={position} size='sm' showArrow={true} content={tooltip} closeDelay={0}>
    <img id={id} src={element.image} alt="Inventory" className={className} ref={setNodeRef} style={style} {...listeners} {...attributes} />
    </Tooltip>
  );
}

export default Draggable;




