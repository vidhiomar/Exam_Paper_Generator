'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const COLORS = ['#4F46E5', '#2563EB', '#06B6D4', '#8B5CF6'];

export default function AnimatedBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const NUM_PARTICLES = 38;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.25 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const drawGradientOrbs = (t: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Orb 1 - indigo
      const g1 = ctx.createRadialGradient(
        w * 0.2 + Math.sin(t * 0.0005) * 60,
        h * 0.3 + Math.cos(t * 0.0007) * 40,
        0,
        w * 0.2,
        h * 0.3,
        w * 0.35
      );
      g1.addColorStop(0, 'rgba(79,70,229,0.07)');
      g1.addColorStop(1, 'rgba(79,70,229,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Orb 2 - cyan
      const g2 = ctx.createRadialGradient(
        w * 0.75 + Math.cos(t * 0.0006) * 50,
        h * 0.2 + Math.sin(t * 0.0008) * 30,
        0,
        w * 0.75,
        h * 0.2,
        w * 0.3
      );
      g2.addColorStop(0, 'rgba(6,182,212,0.06)');
      g2.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Orb 3 - violet
      const g3 = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.0004) * 70,
        h * 0.8 + Math.cos(t * 0.0005) * 40,
        0,
        w * 0.5,
        h * 0.8,
        w * 0.25
      );
      g3.addColorStop(0, 'rgba(139,92,246,0.06)');
      g3.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);
    };

    const drawConnections = () => {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79,70,229,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let startTime = performance.now();

    const animate = (now: number) => {
      const t = now - startTime;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);
      drawGradientOrbs(t);

      // Update & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      drawConnections();
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'normal' }}
      />
    </div>
  );
}
