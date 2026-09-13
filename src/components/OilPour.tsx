"use client";

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  state: "falling" | "settled";
  settledAt: number;
  bucket: number;
  addedHeight: number;
}

const MAX_DROPS = 220;
const BUCKETS = 28;
const GRAVITY = 0.32;
const MAX_MOUND = 120;
const SPAWN_PER_FRAME = 2;

export function OilPour() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glossRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gloss = glossRef.current;
    if (!canvas || !gloss) return;
    const ctx = canvas.getContext("2d");
    const gctx = gloss.getContext("2d");
    if (!ctx || !gctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pourX = 0;
    let raf = 0;
    let t = 0;

    const drops: Drop[] = [];
    const heights = new Float32Array(BUCKETS);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [canvas!, gloss!]) {
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pourX = width * 0.62;
    }

    function bucketOf(x: number) {
      return Math.min(BUCKETS - 1, Math.max(0, Math.floor((x / width) * BUCKETS)));
    }

    function floorAt(x: number) {
      const b = bucketOf(x);
      return height - 36 - heights[b];
    }

    function spawnDrop(): Drop {
      return {
        x: pourX + (Math.random() - 0.5) * 10,
        y: -10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 1 + Math.random(),
        r: 9 + Math.random() * 7,
        state: "falling",
        settledAt: 0,
        bucket: -1,
        addedHeight: 0,
      };
    }

    resize();
    for (let i = 0; i < 40; i++) drops.push(spawnDrop());

    function frame() {
      t += 1;
      ctx!.clearRect(0, 0, width, height);
      gctx!.clearRect(0, 0, width, height);

      if (drops.length < MAX_DROPS) {
        for (let i = 0; i < SPAWN_PER_FRAME; i++) drops.push(spawnDrop());
      }

      // let the pool spread sideways like a viscous liquid, fed
      // continuously from the pour point
      if (t % 2 === 0) {
        const next = new Float32Array(BUCKETS);
        for (let b = 0; b < BUCKETS; b++) {
          const left = b > 0 ? heights[b - 1] : heights[b];
          const right = b < BUCKETS - 1 ? heights[b + 1] : heights[b];
          next[b] = heights[b] + 0.05 * ((left + right) / 2 - heights[b]);
        }
        heights.set(next);
      }

      // draw the falling stream from the pour point
      ctx!.beginPath();
      ctx!.moveTo(pourX, -20);
      ctx!.lineTo(pourX, 40);
      ctx!.lineWidth = 10;
      ctx!.lineCap = "round";
      ctx!.strokeStyle = "#150d07";
      ctx!.stroke();

      for (const d of drops) {
        if (d.state === "falling") {
          d.vy = Math.min(d.vy + GRAVITY, 7.5);
          d.x += d.vx;
          d.y += d.vy;
          const floor = floorAt(d.x);
          if (d.y >= floor) {
            d.y = floor;
            d.vy = 0;
            d.state = "settled";
            d.settledAt = t;
            d.bucket = bucketOf(d.x);
            const add = Math.min(6, MAX_MOUND - heights[d.bucket]);
            heights[d.bucket] += add;
            if (d.bucket > 0) heights[d.bucket - 1] += add * 0.35;
            if (d.bucket < BUCKETS - 1) heights[d.bucket + 1] += add * 0.35;
            d.addedHeight = add;
          }
        } else {
          const life = t - d.settledAt;
          if (life < 20) {
            d.vx *= 0.9;
            d.x += d.vx * (1 - life / 20);
            d.y = floorAt(d.x);
          } else {
            d.y = floorAt(d.x) + Math.sin(t * 0.03 + d.x) * 0.6;
          }
          if (life > 260 + (d.x % 140)) {
            heights[d.bucket] = Math.max(0, heights[d.bucket] - d.addedHeight);
            if (d.bucket > 0) heights[d.bucket - 1] = Math.max(0, heights[d.bucket - 1] - d.addedHeight * 0.35);
            if (d.bucket < BUCKETS - 1) heights[d.bucket + 1] = Math.max(0, heights[d.bucket + 1] - d.addedHeight * 0.35);
            Object.assign(d, spawnDrop());
          }
        }

        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle = "#150d07";
        ctx!.fill();
      }

      // gloss highlight along the pool surface and the falling stream
      gctx!.strokeStyle = "rgba(242, 183, 5, 0.35)";
      gctx!.lineWidth = 2;
      gctx!.beginPath();
      gctx!.moveTo(pourX - 2, -20);
      gctx!.lineTo(pourX - 2, 30);
      gctx!.stroke();

      gctx!.beginPath();
      for (let b = 0; b < BUCKETS; b++) {
        const x = (b + 0.5) * (width / BUCKETS);
        const y = floorAt(x) - 6;
        if (b === 0) gctx!.moveTo(x, y);
        else gctx!.lineTo(x, y);
      }
      gctx!.strokeStyle = "rgba(242, 183, 5, 0.22)";
      gctx!.lineWidth = 3;
      gctx!.stroke();

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ filter: "blur(9px) contrast(28)" }}
      />
      <canvas ref={glossRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
