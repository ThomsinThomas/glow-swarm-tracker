import { useState } from 'react';

interface VintageSwitchProps {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
}

export const VintageSwitch = ({ isOn, onToggle }: VintageSwitchProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onToggle(!isOn);
  };

  return (
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
      {/* Switch base plate */}
      <div className="relative w-24 h-16 bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg shadow-2xl border-2 border-amber-800">
        {/* Mounting screws */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full shadow-inner"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full shadow-inner"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full shadow-inner"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-full shadow-inner"></div>
        
        {/* Switch mechanism */}
        <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={handleClick}
            className={`relative w-16 h-8 bg-gradient-to-b transition-all duration-200 rounded-lg shadow-lg border border-zinc-700 ${
              isPressed
                ? 'from-zinc-500 to-zinc-700 shadow-inner'
                : 'from-zinc-400 to-zinc-600 shadow-xl'
            } ${isPressed ? 'scale-95' : 'hover:scale-105'}`}
          >
            {/* Switch lever */}
            <div 
              className={`absolute w-3 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm shadow-lg transition-all duration-300 border border-amber-700 ${
                isOn 
                  ? 'left-1 top-1' 
                  : 'right-1 top-1'
              } ${isPressed ? 'shadow-inner' : ''}`}
            >
              {/* Lever grip lines */}
              <div className="absolute inset-x-0 top-1 h-px bg-amber-500 opacity-50"></div>
              <div className="absolute inset-x-0 top-2 h-px bg-amber-500 opacity-50"></div>
              <div className="absolute inset-x-0 top-3 h-px bg-amber-500 opacity-50"></div>
              <div className="absolute inset-x-0 top-4 h-px bg-amber-500 opacity-50"></div>
            </div>
            
            {/* Switch track */}
            <div className="absolute inset-1 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded shadow-inner">
              {/* ON/OFF labels */}
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[6px] text-zinc-400 font-bold">ON</div>
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-[6px] text-zinc-400 font-bold">OFF</div>
            </div>
          </button>
        </div>
        
        {/* Status indicator */}
        {isOn && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-lg animate-pulse"></div>
          </div>
        )}
      </div>
      
      {/* Switch label */}
      <div className="mt-2 text-center">
        <div className="text-xs text-amber-700 font-semibold">POWER</div>
      </div>
    </div>
  );
};