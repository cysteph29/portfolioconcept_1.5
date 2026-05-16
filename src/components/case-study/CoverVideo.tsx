"use client";

import { useEffect, useRef } from "react";

export function CoverVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="case-study-cover-video"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    >
      <source src={src} />
    </video>
  );
}
