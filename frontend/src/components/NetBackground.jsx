import React, { useEffect, useRef } from 'react';

/**
 * NetBackground initializes Vanta.js NET (Three.js-based interactive 3D particle constellation)
 * using the configuration provided:
 * color: 0xffffff, backgroundColor: 0x212740, mouseControls: true, touchControls: true
 */
export default function NetBackground({
  color = 0xe8e8e8,
  backgroundColor = 0x15193b,
  className = '',
  children,
}) {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    let intervalId = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.NET && vantaRef.current && !effectRef.current) {
        try {
          effectRef.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color,
            backgroundColor,
            points: 11.0,
            maxDistance: 22.0,
            spacing: 17.0,
          });
          return true;
        } catch (err) {
          console.warn('Could not initialize Vanta NET:', err);
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
  }, [color, backgroundColor]);

  return (
    <div
      ref={vantaRef}
      className={`net-background relative w-full overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {/* Seamless top & bottom blurred gradient feathering */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#17181c] via-[#17181c]/70 to-transparent z-[1] backdrop-blur-[2px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#17181c] via-[#17181c]/70 to-transparent z-[1] backdrop-blur-[2px]"
      />
      {children}
    </div>
  );
}
