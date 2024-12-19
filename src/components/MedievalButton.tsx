import React from 'react';

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const MedievalButton: React.FC<Props> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`border-medievalSepia border-1 text-medievalSepia text-4xl mb-8 px-6 py-3 rounded-lg shadow-lg hover:border-darkSepia transition ${className}`}
    >
      {children}
    </button>
  );
}

export default MedievalButton;