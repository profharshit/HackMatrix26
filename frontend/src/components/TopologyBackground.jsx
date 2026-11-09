import React, { useEffect, useRef } from 'react';

/**
 * TopologyBackground initializes Vanta.js Topology (p5.js-based interactive wave wireframe)
 * using the configuration provided:
 * color: 0xefefef, backgroundColor: 0x232e81, mouseControls: true, touchControls: true
 */
export default function TopologyBackground({
  color = 0xefefef,
  backgroundColor = 0x232e81,
  className = '',
  children,
}) {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    let intervalId = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.TOPOLOGY && vantaRef.current && !effectRef.current) {
        try {
          effectRef.current = window.VANTA.TOPOLOGY({
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
          });
          return true;
        } catch (err) {
          console.warn('Could not initialize Vanta Topology:', err);
        }
      }
      return false;
    };

    if (!initVanta()) {
      // Poll briefly if scripts are loading asynchronously
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
      className={`relative w-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
