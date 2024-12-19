import React from 'react';

interface Props {
  handleBack?: () => void;
}

const KaotikaBackButton: React.FC<Props> = ({ handleBack }) => {
  return (
    <button
      onClick={handleBack}
      className="bg-blackSepia w-full text-white text-3xl py-2 px-4 mt-5 rounded hover:bg-black transition "
    >
    Back
    </button>
  );
}

export default KaotikaBackButton;