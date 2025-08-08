import { useState, useEffect } from 'react';
import bulbImage from '@/assets/vintage-bulb.png';

interface VintageBulbProps {
  isOn: boolean;
}

export const VintageBulb = ({ isOn }: VintageBulbProps) => {
  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
      {/* Electrical cord */}
      <div className="w-1 h-20 bg-gradient-to-b from-gray-800 to-gray-700 mx-auto mb-2 rounded-full"></div>
      
      {/* Bulb socket */}
      <div className="w-12 h-8 bg-gradient-to-b from-zinc-700 to-zinc-800 mx-auto mb-2 rounded-t-lg border border-zinc-600"></div>
      
      {/* Bulb container with glow effect */}
      <div className={`relative transition-all duration-300 ${isOn ? 'bulb-glow' : ''}`}>
        <img 
          src={bulbImage} 
          alt="Vintage Filament Bulb"
          className={`w-32 h-40 object-contain transition-all duration-500 ${
            isOn 
              ? 'brightness-125 saturate-110' 
              : 'brightness-50 saturate-50'
          }`}
          style={{
            imageRendering: 'crisp-edges',
            filter: isOn 
              ? 'brightness(1.25) saturate(1.1) contrast(1.1)' 
              : 'brightness(0.5) saturate(0.5) contrast(0.8)'
          }}
        />
        
        {/* Warm glow overlay when on */}
        {isOn && (
          <>
            <div className="absolute inset-0 bg-amber-400 opacity-20 rounded-full blur-xl scale-150"></div>
            <div className="absolute inset-0 bg-yellow-300 opacity-10 rounded-full blur-2xl scale-200"></div>
            <div className="absolute inset-0 bg-orange-400 opacity-15 rounded-full blur-3xl scale-300"></div>
          </>
        )}
      </div>
    </div>
  );
};