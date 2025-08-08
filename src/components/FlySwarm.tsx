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
      // Generate flies from different screen areas when light turns on
      const newFlies: Fly[] = [];
      for (let i = 0; i < 20; i++) {
        let startX, startY;
        
        // Spawn flies from different edges and corners
        const spawnArea = Math.floor(Math.random() * 8);
        switch (spawnArea) {
          case 0: // Top edge
            startX = Math.random() * window.innerWidth;
            startY = -20;
            break;
          case 1: // Bottom edge
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + 20;
            break;
          case 2: // Left edge
            startX = -20;
            startY = Math.random() * window.innerHeight;
            break;
          case 3: // Right edge
            startX = window.innerWidth + 20;
            startY = Math.random() * window.innerHeight;
            break;
          case 4: // Top-left corner area
            startX = Math.random() * 200;
            startY = Math.random() * 200;
            break;
          case 5: // Top-right corner area
            startX = window.innerWidth - Math.random() * 200;
            startY = Math.random() * 200;
            break;
          case 6: // Bottom-left corner area
            startX = Math.random() * 200;
            startY = window.innerHeight - Math.random() * 200;
            break;
          default: // Bottom-right corner area
            startX = window.innerWidth - Math.random() * 200;
            startY = window.innerHeight - Math.random() * 200;
            break;
        }

        // Initial gentle velocity toward the light
        const dx = lightX - startX;
        const dy = lightY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedVx = (dx / distance) * (0.3 + Math.random() * 0.2);
        const normalizedVy = (dy / distance) * (0.3 + Math.random() * 0.2);

        newFlies.push({
          id: i,
          x: startX,
          y: startY,
          vx: normalizedVx,
          vy: normalizedVy,
          angle: Math.random() * Math.PI * 2,
          speed: 0.8 + Math.random() * 0.7,
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

          // Gentle attraction to light with realistic fly behavior
          const dx = lightX - x;
          const dy = lightY - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Much gentler attraction forces for realistic movement
          let attractionForce;
          if (distance > 500) {
            // Very gentle pull when far away
            attractionForce = 0.08;
          } else if (distance > 200) {
            // Slight pull in middle range
            attractionForce = 0.05;
          } else {
            // Minimal attraction when close, mostly random movement
            attractionForce = 0.02;
          }

          vx += (dx / distance) * attractionForce;
          vy += (dy / distance) * attractionForce;

          // Add gentle swirling motion around the light when close
          if (distance < 150) {
            const perpX = -dy / distance;
            const perpY = dx / distance;
            vx += perpX * 0.08;
            vy += perpY * 0.08;
          }

          // Add subtle random movement for natural flight pattern
          vx += (Math.random() - 0.5) * 0.15;
          vy += (Math.random() - 0.5) * 0.15;

          // Gently limit speed for realistic movement
          const currentSpeed = Math.sqrt(vx * vx + vy * vy);
          if (currentSpeed > speed) {
            vx = (vx / currentSpeed) * speed;
            vy = (vy / currentSpeed) * speed;
          }

          // Update position
          x += vx;
          y += vy;

          // Keep flies within screen bounds, but allow them to approach from outside initially
          const screenMargin = 50;
          if (x < -screenMargin) {
            x = -screenMargin;
            vx = Math.abs(vx);
          }
          if (x > window.innerWidth + screenMargin) {
            x = window.innerWidth + screenMargin;
            vx = -Math.abs(vx);
          }
          if (y < -screenMargin) {
            y = -screenMargin;
            vy = Math.abs(vy);
          }
          if (y > window.innerHeight + screenMargin) {
            y = window.innerHeight + screenMargin;
            vy = -Math.abs(vy);
          }

          // Update angle for slower, more realistic rotation
          angle += 0.03 + Math.random() * 0.02;

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
          className={`absolute transition-none ${fly.isFalling ? 'fly falling' : ''}`}
          style={{
            left: fly.x - 8,
            top: fly.y - 8,
            transform: `rotate(${fly.angle}rad)`,
            zIndex: 10,
          }}
        >
          <img 
            src={flyImage} 
            alt="Fly"
            className="w-4 h-4 object-contain opacity-90"
            style={{
              filter: 'brightness(0.3) sepia(1) hue-rotate(25deg) saturate(1.5) contrast(1.2)',
              imageRendering: 'crisp-edges',
            }}
          />
        </div>
      ))}
    </div>
  );
};
