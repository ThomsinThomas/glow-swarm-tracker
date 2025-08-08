import { useState, useEffect, useRef } from 'react';
import flyImage from '@/assets/housefly.png';

interface Fly {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  isFalling: boolean;
}

interface FlySwarmProps {
  isLightOn: boolean;
  onFlyCountChange: (count: number) => void;
}

export const FlySwarm = ({ isLightOn, onFlyCountChange }: FlySwarmProps) => {
  const [flies, setFlies] = useState<Fly[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Light position (center of bulb)
  const lightX = window.innerWidth / 2;
  const lightY = 120;

  useEffect(() => {
    if (isLightOn) {
      // Generate flies when light turns on
      const newFlies: Fly[] = [];
      for (let i = 0; i < 15; i++) {
        newFlies.push({
          id: i,
          x: lightX + (Math.random() - 0.5) * 200,
          y: lightY + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          angle: Math.random() * Math.PI * 2,
          speed: 1 + Math.random() * 2,
          isFalling: false,
        });
      }
      setFlies(newFlies);
      onFlyCountChange(newFlies.length);
    } else {
      // Make all flies fall when light turns off
      setFlies(prev => prev.map(fly => ({ ...fly, isFalling: true })));
      onFlyCountChange(0);
      
      // Remove fallen flies after animation
      setTimeout(() => {
        setFlies([]);
      }, 2000);
    }
  }, [isLightOn, lightX, lightY, onFlyCountChange]);

  useEffect(() => {
    if (!isLightOn || flies.length === 0) return;

    const animate = () => {
      setFlies(prevFlies => 
        prevFlies.filter(fly => !fly.isFalling).map(fly => {
          let { x, y, vx, vy, angle, speed } = fly;

          // Attraction to light with some randomness
          const dx = lightX - x;
          const dy = lightY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Add attraction force (stronger when closer)
          const attractionForce = Math.min(0.3, 50 / distance);
          vx += (dx / distance) * attractionForce * (0.5 + Math.random() * 0.5);
          vy += (dy / distance) * attractionForce * (0.5 + Math.random() * 0.5);

          // Add random movement for natural flight pattern
          vx += (Math.random() - 0.5) * 0.5;
          vy += (Math.random() - 0.5) * 0.5;

          // Limit speed
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          if (currentSpeed > speed) {
            vx = (vx / currentSpeed) * speed;
            vy = (vy / currentSpeed) * speed;
          }

          // Update position
          x += vx;
          y += vy;

          // Keep flies within reasonable bounds around the light
          const maxDistance = 300;
          if (distance > maxDistance) {
            x = lightX + (dx / distance) * maxDistance * 0.9;
            y = lightY + (dy / distance) * maxDistance * 0.9;
          }

          // Update angle for rotation
          angle += 0.1 + Math.random() * 0.1;

          return { ...fly, x, y, vx, vy, angle };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLightOn, flies.length, lightX, lightY]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      {flies.map(fly => (
        <div
          key={fly.id}
          className={`absolute w-3 h-3 transition-none ${fly.isFalling ? 'fly falling' : ''}`}
          style={{
            left: fly.x - 6,
            top: fly.y - 6,
            transform: `rotate(${fly.angle}rad)`,
            zIndex: 10,
          }}
        >
          <img 
            src={flyImage} 
            alt="Fly"
            className="w-full h-full object-contain opacity-80"
            style={{
              filter: 'brightness(0.4) sepia(1) hue-rotate(30deg) saturate(2)',
            }}
          />
        </div>
      ))}
    </div>
  );
};
