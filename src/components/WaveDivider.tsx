"use client";

import { useEffect, useRef } from "react";

const PERIOD = 180;
const PERIODS = 20;
const AMPLITUDE = 14;
const HEIGHT = 40;
const TILE_WIDTH = PERIOD * PERIODS;
const DURATION_MS = 28000; // one full tile-width loop — 2x slower than before

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

function WaveStrip({ reverse, flip }: { reverse: boolean; flip: boolean }) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const pxPerMs = TILE_WIDTH / DURATION_MS;
    let raf = 0;
    let offset = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = now - last;
      last = now;
      offset = (offset + pxPerMs * dt) % TILE_WIDTH;
      const x = reverse ? offset - TILE_WIDTH : -offset;
      if (strip) strip.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  return (
    <div
      className="relative w-full overflow-hidden bg-background"
      style={{ height: HEIGHT, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <div ref={stripRef} className="absolute inset-y-0 left-0 flex" style={{ width: TILE_WIDTH * 2 }}>
        <svg width={TILE_WIDTH} height={HEIGHT} viewBox={`0 0 ${TILE_WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
          <path d={WAVE_PATH} fill="#050505" />
        </svg>
        <svg width={TILE_WIDTH} height={HEIGHT} viewBox={`0 0 ${TILE_WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
          <path d={WAVE_PATH} fill="#050505" />
        </svg>
      </div>
    </div>
  );
}

export function WaveDivider() {
  return (
    <div aria-hidden className="sticky top-20 z-30 flex w-full flex-col">
      <WaveStrip reverse flip />
      <WaveStrip reverse={false} flip={false} />
    </div>
  );
}
