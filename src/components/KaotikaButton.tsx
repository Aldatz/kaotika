import React from 'react';

interface Props {
    handleClick?: () => void;
    text: string;
}

const KaotikaButton: React.FC<Props> = ({ handleClick, text }) => {
  return (
    <button
      onClick={handleClick}
      className="bg-medievalSepia w-full text-black text-3xl py-2 px-4 mb-4 rounded hover:bg-darkSepia  transition"
    >
   {text}
    </button>
  );
}

export default KaotikaButton;