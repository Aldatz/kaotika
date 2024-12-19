import React from 'react';
import { SpinnerKaotika } from './SpinnerKaotika';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <SpinnerKaotika size="lg" color='warning' />
    </div>
  );
};

export default Loading;