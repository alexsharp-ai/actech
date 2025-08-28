"use client";
import React, { useEffect, useRef, useState } from "react";

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  inline?: boolean;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ src, poster, inline = true, className = "", ...rest }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            // lazy load source only once
            if (!loaded) {
              el.src = src;
              setLoaded(true);
            }
            // always attempt to play when (re)entering viewport
            el.play().catch(()=>{});
          } else {
            // Do NOT permanently stop playback; optionally pause to save resources
            // Comment out next line to allow continuous background playback
            el.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src, loaded]);

  return (
    <video
      ref={ref}
      muted
      playsInline={inline}
      loop
      autoPlay
      preload="none"
      poster={poster}
      className={className + " transition-opacity duration-500 " + (loaded ? "opacity-100" : "opacity-0")}
      {...rest}
    />
  );
};

export default LazyVideo;