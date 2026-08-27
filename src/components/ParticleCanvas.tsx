import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  twinklePhase: number;
}

interface Props {
  density?: 'subtle' | 'high' | 'ultra';
  intensity?: number;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const ParticleCanvas: React.FC<Props> = ({
  density = 'ultra',
  intensity = 1.0,
  className = '',
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1280);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 720);

    const countMap = { subtle: 35, high: 75, ultra: 130 };
    const count = Math.floor(countMap[density] * intensity);

    const particles: Particle[] = [];
    const colors = [
      'rgba(255, 215, 0, ',     // Pure Gold
      'rgba(255, 195, 45, ',    // Warm Amber
      'rgba(255, 240, 160, ',   // Pale Gold Sparkle
      'rgba(245, 158, 11, ',    // Deep Amber
      'rgba(255, 255, 255, ',   // White Diamond Specular
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3.5 + 1.0,
        speedX: (Math.random() - 0.4) * 0.6,
        speedY: (Math.random() - 0.7) * 0.8, // subtle upward floating drift
        opacity: Math.random() * 0.8 + 0.2,
        fadeSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw Top-Right Golden Aura / Light Beam
      const grad = ctx.createRadialGradient(
        width * 0.88,
        height * 0.15,
        10,
        width * 0.88,
        height * 0.15,
        width * 0.45
      );
      grad.addColorStop(0, 'rgba(255, 215, 0, 0.18)');
      grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'rgba(10, 25, 47, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle glow
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.95 || p.opacity < 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        const currentOpacity = Math.max(0.1, Math.min(1.0, p.opacity + Math.sin(time * 0.003 + p.twinklePhase) * 0.2));

        // Draw particle glow
        ctx.beginPath();
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        pGrad.addColorStop(0, `${p.color}${currentOpacity})`);
        pGrad.addColorStop(0.5, `${p.color}${currentOpacity * 0.4})`);
        pGrad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = pGrad;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core bright center
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.9})`;
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, intensity, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
    />
  );
};
