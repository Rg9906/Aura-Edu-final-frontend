import React from 'react';
import { motion } from 'framer-motion';
import { AuraEvent } from '../../domain/models';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HaloSystemProps {
  activeDirection?: AuraEvent['direction'];
  awarenessIndex: number;
}

const DIRECTIONS: AuraEvent['direction'][] = [
  'front', 'front-right', 'right', 'back-right', 
  'back', 'back-left', 'left', 'front-left'
];

export const HaloSystem: React.FC<HaloSystemProps> = ({ activeDirection, awarenessIndex }) => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Segments */}
      <div className="absolute inset-0">
        {DIRECTIONS.map((dir, i) => {
          const rotation = -22.5 + (i * 45);
          const isActive = activeDirection === dir;
          
          return (
            <div 
              key={dir}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.1,
                  backgroundColor: isActive ? 'rgba(0, 228, 117, 0.15)' : 'rgba(0, 228, 117, 0.03)',
                  borderColor: isActive ? '#00e475' : 'rgba(205, 196, 204, 0.1)',
                }}
                className={cn(
                  "absolute w-1/2 h-1/2 top-0 left-1/2 origin-[0%_100%] border-t-2 border-r-2 transition-colors duration-300",
                  "clip-path-wedge"
                )}
                style={{
                  clipPath: 'polygon(0% 100%, 0% 0%, 41.4% 0%, 0% 100%)'
                }}
              />
              {/* Divider */}
              <div className="absolute w-[1px] h-1/2 bg-on-surface-variant/10 left-1/2 top-0 origin-bottom" />
            </div>
          );
        })}
      </div>

      {/* Center Core */}
      <div className="relative z-20 w-36 h-36 bg-background rounded-full flex flex-col items-center justify-center border border-outline-variant shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Awareness</div>
        <motion.div 
          key={awarenessIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black text-primary my-1"
        >
          {awarenessIndex.toFixed(1)}
        </motion.div>
        <div className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Index</div>
      </div>

      {/* Degree Marker */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold text-primary">000°</span>
        <div className="w-[2px] h-2 bg-primary mt-1" />
      </div>
    </div>
  );
};
