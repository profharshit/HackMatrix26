import React, { useEffect, useRef } from 'react';

/**
 * DotsBackground initializes Vanta.js DOTS (Three.js-based interactive floating wave dots)
 * using the configuration provided:
 * color: 0xcccccc, color2: 0xc0c0c0, mouseControls: true, touchControls: true
 */
export default function DotsBackground({
  color = 0xcccccc,
  color2 = 0xc0c0c0,
  backgroundColor = 0x17181c,
  className = '',
  children,
}) {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    let intervalId = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.DOTS && vantaRef.current && !effectRef.current) {
        try {
          effectRef.current = window.VANTA.DOTS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color,
            color2,
            backgroundColor,
          });
          return true;
        } catch (err) {
          console.warn('Could not initialize Vanta DOTS:', err);
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
  }, [color, color2, backgroundColor]);

  return (
    <div
      ref={vantaRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      {/* Soft edge blend for smooth section transition */}
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
