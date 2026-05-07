import { useEffect, useRef } from "react";
import "./AnimatedBackground.css";

interface Packet {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  trailLen: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let packets: Packet[] = [];

    const CYAN = "6,182,212";

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const W = canvas.width;
      const H = canvas.height;

      const streamCount = Math.max(4, Math.floor(W / 100));
      packets = [];
      for (let s = 0; s < streamCount; s++) {
        const sx = (W / streamCount) * (s + 0.2 + Math.random() * 0.6);
        const pCount = 3 + Math.floor(Math.random() * 5);
        for (let i = 0; i < pCount; i++) {
          packets.push({
            x: sx + (Math.random() - 0.5) * 14,
            y: Math.random() * H,
            speed: 0.7 + Math.random() * 1.6,
            size: 2.5 + Math.random() * 3.5,
            opacity: 0.35 + Math.random() * 0.55,
            trailLen: 8 + Math.floor(Math.random() * 14),
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      packets.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -p.size * p.trailLen) {
          p.y = canvas.height + p.size * 2;
          p.opacity = 0.35 + Math.random() * 0.55;
          p.x += (Math.random() - 0.5) * 8;
        }

        for (let i = 1; i <= p.trailLen; i++) {
          const ty = p.y + i * (p.speed * 2.2);
          if (ty > canvas.height) break;
          const to = p.opacity * (1 - i / p.trailLen) * 0.45;
          ctx.fillStyle = `rgba(${CYAN},${to})`;
          ctx.fillRect(p.x - p.size / 2, ty, p.size, p.size * 0.7);
        }

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#06b6d4";
        ctx.fillStyle = `rgba(${CYAN},${p.opacity})`;
        ctx.fillRect(p.x - p.size / 2, p.y, p.size, p.size);
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    setup();
    draw();

    window.addEventListener("resize", setup);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-bg" />;
};

export default AnimatedBackground;
