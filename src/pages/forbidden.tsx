import getConfig from 'next/config';
import {  } from 'react';

const Forbidden = () => {
  
  const { publicRuntimeConfig } = getConfig();

  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center flex-row">
				<div>
					<h1 className="text-8xl mb-4 text-medievalSepia">LEGENDS</h1>
					<h1 className="text-6xl mb-4 text-medievalSepia">of</h1>
					<img
						className="mx-auto mb-8"
						src="/images/kaotika.png"  
						alt="Medieval Logo"
					/>
				</div>
				<div>
					<h1 className="text-3xl mb-4 text-medievalSepia">You are not allowed to enter into Kaotika's Realm</h1>
				</div>
				<div>
					<h1 className="text-3xl mb-4 text-medievalSepia">Developed by Mortimer. Version: {publicRuntimeConfig?.version}</h1>
				</div>
      </div>
    </div>
  );
};

export default Forbidden;