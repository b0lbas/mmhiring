'use client';

import React from 'react';

const sections = Array.from({ length: 6 }, (_, i) => ({
  angle: i * 60,
  text: 'Lorem ipsum dolor sit amet',
}));

export default function CircleSection() {
  const circleRadius = 120;
  const lineLength = 80;
  
  return (
    <section className="w-full py-20 relative">
      <div className="container mx-auto px-4">
        <div className="relative w-full min-h-[600px] flex justify-center items-center">
          <div className="relative">
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-full border-4 border-white/30 flex items-center justify-center relative z-10">
              <p className="text-white text-xl md:text-2xl font-bold">MatchMakers</p>
            </div>
            
            {sections.map(({ angle, text }, idx) => {
              const radians = (angle * Math.PI) / 180;
              const startX = Math.cos(radians) * circleRadius;
              const startY = Math.sin(radians) * circleRadius;
              const endX = Math.cos(radians) * (circleRadius + lineLength);
              const endY = Math.sin(radians) * (circleRadius + lineLength);
              
              return (
                <div key={idx} className="absolute top-1/2 left-1/2 w-full h-full">
                  <div
                    className="absolute bg-white/30"
                    style={{
                      width: '2px',
                      height: `${lineLength}px`,
                      top: `calc(50% + ${startY}px)`,
                      left: `calc(50% + ${startX}px)`,
                      transformOrigin: 'top',
                      transform: `rotate(${angle}deg)`,
                    }}
                  />
                  
                  <div
                    className="absolute bg-white/5 backdrop-blur-glass p-3 md:p-4 rounded-lg text-white/90 text-center border border-white/10 shadow-lg"
                    style={{
                      minWidth: '120px',
                      top: `calc(50% + ${endY + 10}px)`,
                      left: `calc(50% + ${endX}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <p className="text-sm md:text-lg">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
