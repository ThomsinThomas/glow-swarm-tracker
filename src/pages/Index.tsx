import { useState } from 'react';
import { VintageBulb } from '@/components/VintageBulb';
import { VintageSwitch } from '@/components/VintageSwitch';
import { FlySwarm } from '@/components/FlySwarm';
import { FlyCounter } from '@/components/FlyCounter';

const Index = () => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [flyCount, setFlyCount] = useState(0);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* Main simulation area */}
      <div className="absolute inset-0">
        <VintageBulb isOn={isLightOn} />
        <VintageSwitch isOn={isLightOn} onToggle={setIsLightOn} />
        <FlySwarm isLightOn={isLightOn} onFlyCountChange={setFlyCount} />
        <FlyCounter flyCount={flyCount} isLightOn={isLightOn} />
      </div>
      
      {/* Subtle instructions */}
      <div className="absolute bottom-4 left-4 text-xs opacity-30 text-amber-600">
        Click the switch to control the light
      </div>
    </div>
  );
};

export default Index;
