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

interface Node {
  x: number;
  y: number;
  r: number;
  phase: number;
  phaseSpeed: number;
}

interface Traveler {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  t: number;
  speed: number;
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
    let nodes: Node[] = [];
    let travelers: Traveler[] = [];
    let edges: [Node, Node][] = [];

    const CYAN = "6,182,212";
    const MAX_EDGE = 320;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const W = canvas.width;
      const H = canvas.height;

      // Upload stream packets — moving upward
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

      // Network nodes
      const nodeCount = Math.min(Math.max(6, Math.floor(W / 180)), 16);
      nodes = Array.from({ length: nodeCount }, () => ({
        x: 60 + Math.random() * (W - 120),
        y: 60 + Math.random() * (H - 120),
        r: 3.5 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.018 + Math.random() * 0.022,
      }));

      // Build edges
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < MAX_EDGE) {
            edges.push([nodes[i], nodes[j]]);
          }
        }
      }

      // Travelers along edges
      travelers = edges
        .filter(() => Math.random() < 0.7)
        .map(([a, b]) => ({
          fromX: a.x, fromY: a.y,
          toX: b.x,   toY: b.y,
          t: Math.random(),
          speed: 0.0025 + Math.random() * 0.004,
        }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Connection lines
      ctx.lineWidth = 0.8;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${CYAN},0.18)`;
        ctx.stroke();
      });

      // 2. Data travelers along edges
      ctx.shadowColor = "#06b6d4";
      travelers.forEach((tr) => {
        tr.t += tr.speed;
        if (tr.t > 1) tr.t = 0;
        const x = tr.fromX + (tr.toX - tr.fromX) * tr.t;
        const y = tr.fromY + (tr.toY - tr.fromY) * tr.t;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},0.95)`;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 3. Nodes with pulse rings
      nodes.forEach((n) => {
        n.phase += n.phaseSpeed;
        const pulse = (Math.sin(n.phase) + 1) / 2;

        // Outer ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 10 + pulse * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},${0.06 + pulse * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Middle ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},${0.25 + pulse * 0.2})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Core
        ctx.shadowBlur = 16;
        ctx.shadowColor = "#06b6d4";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},${0.55 + pulse * 0.35})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Upload stream packets (moving upward)
      packets.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -p.size * p.trailLen) {
          p.y = canvas.height + p.size * 2;
          p.opacity = 0.35 + Math.random() * 0.55;
          p.x += (Math.random() - 0.5) * 8;
        }

        // Trail (fading rectangles below the packet)
        for (let i = 1; i <= p.trailLen; i++) {
          const ty = p.y + i * (p.speed * 2.2);
          if (ty > canvas.height) break;
          const to = p.opacity * (1 - i / p.trailLen) * 0.45;
          ctx.fillStyle = `rgba(${CYAN},${to})`;
          ctx.fillRect(p.x - p.size / 2, ty, p.size, p.size * 0.7);
        }

        // Packet head with glow
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
