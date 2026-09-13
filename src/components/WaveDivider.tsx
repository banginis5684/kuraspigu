"use client";

import { useEffect, useRef } from "react";

const PERIOD = 180;
const PERIODS = 20;
const AMPLITUDE = 14;
const HEIGHT = 48;
const TILE_WIDTH = PERIOD * PERIODS;
const PX_PER_MS = TILE_WIDTH / 14000; // one full tile-width loop every 14s

function buildWavePath(): string {
  let d = `M0,${HEIGHT / 2}`;
  for (let i = 0; i < PERIODS; i++) {
    const x0 = i * PERIOD;
    d += ` C${x0 + PERIOD * 0.25},${HEIGHT / 2 - AMPLITUDE} ${x0 + PERIOD * 0.25},${HEIGHT / 2 + AMPLITUDE} ${x0 + PERIOD * 0.5},${HEIGHT / 2}`;
    d += ` C${x0 + PERIOD * 0.75},${HEIGHT / 2 - AMPLITUDE} ${x0 + PERIOD * 0.75},${HEIGHT / 2 + AMPLITUDE} ${x0 + PERIOD},${HEIGHT / 2}`;
  }
  d += ` L${TILE_WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
  return d;
}

const WAVE_PATH = buildWavePath();

export function WaveDivider() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let offset = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = now - last;
      last = now;
      offset = (offset + PX_PER_MS * dt) % TILE_WIDTH;
      if (strip) strip.style.transform = `translateX(${-offset}px)`;
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="sticky top-20 z-30 w-full overflow-hidden bg-background"
      style={{ height: HEIGHT }}
    >
      <div ref={stripRef} className="absolute inset-y-0 left-0 flex" style={{ width: TILE_WIDTH * 2 }}>
        <svg
          width={TILE_WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${TILE_WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH} fill="#050505" />
        </svg>
        <svg
          width={TILE_WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${TILE_WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH} fill="#050505" />
        </svg>
      </div>
    </div>
  );
}
