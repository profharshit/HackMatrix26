import React, { useEffect, useRef } from 'react';

/**
 * BirdsBackground initializes Vanta.js BIRDS (Three.js-based interactive 3D flocking boids)
 * using the configuration provided:
 * color1: 0xd9d9d9, mouseControls: true, touchControls: true
 */
export default function BirdsBackground({
  color1 = 0xd9d9d9,
  color2 = 0x22396F,
  backgroundColor = 0x17181c,
  className = '',
  children,
}) {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    let intervalId = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.BIRDS && vantaRef.current && !effectRef.current) {
        try {
          effectRef.current = window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color1,
            color2,
            backgroundColor,
            quantity: 3.5,
            birdSize: 1.2,
            wingSpan: 24.0,
            speedLimit: 4.0,
            separation: 40.0,
            alignment: 40.0,
            cohesion: 40.0,
          });
          return true;
        } catch (err) {
          console.warn('Could not initialize Vanta BIRDS:', err);
        }
      }
      return false;
    };

    if (!initVanta()) {
      let attempts = 0;
      intervalId = setInterval(() => {
        attempts++;
        if (initVanta() || attempts > 20) {
          clearInterval(intervalId);
        }
      }, 150);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
        } catch {
          // ignore cleanup error
        }
        effectRef.current = null;
      }
    };
  }, [color1, color2, backgroundColor]);

  return (
    <div
      ref={vantaRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      {/* Soft edge blend for smooth seamless section transition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#17181c] via-[#17181c]/70 to-transparent z-[1] backdrop-blur-[1px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#17181c] via-[#17181c]/70 to-transparent z-[1] backdrop-blur-[1px]"
      />
      {children}
    </div>
  );
}
