import React from 'react';

interface Props {
    handleNext?: () => void;
}

const KaotikaNextButton: React.FC<Props> = ({ handleNext }) => {
  return (
    <button
      onClick={handleNext}
      className="bg-medievalSepia w-full text-black text-3xl py-2 px-4 mt-5 rounded hover:bg-darkSepia  transition"
    >
    Next
    </button>
  );
}

export default KaotikaNextButton;