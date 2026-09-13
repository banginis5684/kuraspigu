"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  hue: "ink" | "gold";
}

const PARTICLE_COUNT = 220;
const NOISE_SCALE = 0.0026;
const TIME_SCALE = 0.00012;
const SPEED = 0.9;
const MOUSE_RADIUS = 160;

export function FluidHeaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const noise3D = createNoise3D();
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
    let lastMouse = { x: -9999, y: -9999 };
    let raf = 0;

    function spawnParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        age: 0,
        maxAge: 160 + Math.random() * 200,
        hue: Math.random() < 0.06 ? "gold" : "ink",
      };
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#050505";
      ctx!.fillRect(0, 0, width, height);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      lastMouse = { x: mouse.x, y: mouse.y };
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.vx = mouse.x - lastMouse.x;
      mouse.vy = mouse.y - lastMouse.y;
    }

    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, spawnParticle);

    if (reduceMotion) {
      // Static gradient only — no animation loop.
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#050505");
      gradient.addColorStop(1, "#161311");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      const onResizeStatic = () => resize();
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let t = 0;
    function frame() {
      t += 1;
      // Fade previous frame slightly for a trailing "flowing water" look.
      ctx!.fillStyle = "rgba(5, 5, 5, 0.12)";
      ctx!.fillRect(0, 0, width, height);

      for (const p of particles) {
        const angle =
          noise3D(p.x * NOISE_SCALE, p.y * NOISE_SCALE, t * TIME_SCALE) *
          Math.PI *
          4;
        let dx = Math.cos(angle);
        let dy = Math.sin(angle);

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * 1.6;
          const speedBoost = Math.min(
            Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy) / 6,
            2.5
          );
          dx += (mdx / (dist || 1)) * force * (0.6 + speedBoost);
          dy += (mdy / (dist || 1)) * force * (0.6 + speedBoost);
        }

        const prevX = p.x;
        const prevY = p.y;
        p.x += dx * SPEED;
        p.y += dy * SPEED;
        p.age += 1;

        ctx!.beginPath();
        ctx!.moveTo(prevX, prevY);
        ctx!.lineTo(p.x, p.y);
        ctx!.strokeStyle =
          p.hue === "gold"
            ? "rgba(242, 183, 5, 0.35)"
            : "rgba(210, 210, 210, 0.22)";
        ctx!.lineWidth = p.hue === "gold" ? 1.1 : 0.9;
        ctx!.stroke();

        if (
          p.age > p.maxAge ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          Object.assign(p, spawnParticle());
        }
      }

      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
