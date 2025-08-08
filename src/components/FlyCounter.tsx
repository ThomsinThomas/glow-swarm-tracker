import { useState, useEffect } from 'react';

interface FlyCounterProps {
  flyCount: number;
  isLightOn: boolean;
}

export const FlyCounter = ({ flyCount, isLightOn }: FlyCounterProps) => {
  const [detectedFlies, setDetectedFlies] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isLightOn && flyCount > 0) {
      setIsScanning(true);
      
      // Simulate AI detection with some delay and variation
      const detectInterval = setInterval(() => {
        const detectionAccuracy = 0.85 + Math.random() * 0.15; // 85-100% accuracy
        const detected = Math.floor(flyCount * detectionAccuracy);
        setDetectedFlies(detected);
      }, 200);

      return () => clearInterval(detectInterval);
    } else {
      setIsScanning(false);
      setDetectedFlies(0);
    }
  }, [flyCount, isLightOn]);

  return (
    <div className="fixed top-4 right-4 counter p-4 rounded-lg min-w-[200px]">
      <div className="text-sm font-semibold mb-2 text-amber-400">
        🤖 AI FLY DETECTOR
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-75">Status:</span>
          <span className={`text-xs font-mono ${isScanning ? 'text-green-400' : 'text-red-400'}`}>
            {isScanning ? '● SCANNING' : '● OFFLINE'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-75">Detected:</span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {detectedFlies.toString().padStart(2, '0')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs opacity-75">Actual:</span>
          <span className="text-sm font-mono text-amber-500">
            {flyCount.toString().padStart(2, '0')}
          </span>
        </div>
        
        {isScanning && (
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-75">Accuracy:</span>
            <span className="text-xs font-mono text-green-400">
              {flyCount > 0 ? Math.round((detectedFlies / flyCount) * 100) : 0}%
            </span>
          </div>
        )}
      </div>

      {/* Scanning animation */}
      {isScanning && (
        <div className="mt-3 relative">
          <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent w-1/3 animate-pulse rounded"></div>
          </div>
          <div className="text-xs text-center mt-1 opacity-50">
            Neural Network Processing...
          </div>
        </div>
      )}
    </div>
  );
};