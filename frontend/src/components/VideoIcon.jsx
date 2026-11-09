import React, { useRef, useState } from 'react';

/**
 * VideoIcon renders an animated MP4 icon with smooth playback,
 * responsive sizing, rounded container styling, and Lucide fallback support.
 */
export default function VideoIcon({
  src,
  alt = 'Icon',
  size = 'md',
  className = '',
  videoClassName = '',
  fallback: FallbackIcon = null,
  container = true,
}) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  // Sizing presets
  const sizeMap = {
    xs: 'h-6 w-6 rounded-lg p-0.5',
    sm: 'h-8 w-8 rounded-xl p-1',
    md: 'h-12 w-12 rounded-2xl p-1.5',
    lg: 'h-16 w-16 rounded-2xl p-2',
    xl: 'h-20 w-20 rounded-3xl p-2.5',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  if (hasError && FallbackIcon) {
    return <FallbackIcon className={className} />;
  }

  const videoElement = (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      controls={false}
      preload="auto"
      onError={() => setHasError(true)}
      aria-label={alt}
      className={`h-full w-full object-contain pointer-events-none rounded-inherit ${videoClassName}`}
    />
  );

  if (!container) {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
        {videoElement}
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border border-[#22396F]/30 ${containerSize} ${className}`}
    >
      {videoElement}
    </div>
  );
}
