import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  color: string;
  alpha: number;
  phase: number;
  frequency: number;
  bright: boolean;
};

type Ripple = { x: number; y: number; start: number };
type TrailPoint = { x: number; y: number; time: number };
type TrailSpark = { x: number; y: number; vx: number; vy: number; start: number; life: number; size: number; color: string };

const STAR_TONES = [
  '235,243,255', '205,226,255', '255,240,218', '172,207,255',
  '255,221,179', '245,248,255', '255,255,255',
];

function randomSource(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function gaussian(random: () => number) {
  const u = Math.max(random(), 0.00001);
  const v = Math.max(random(), 0.00001);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeStars(width: number, height: number): Star[] {
  const random = randomSource(Math.round(width * 13 + height * 29 + 2026));
  const total = Math.min(2700, Math.max(900, Math.floor((width * height) / 620)));
  const stars: Star[] = [];

  for (let i = 0; i < total; i += 1) {
    const inGalacticBand = random() < 0.72;
    const x = random() * width;
    const galacticCenter = height * (0.39 + 0.16 * Math.sin((x / Math.max(width, 1)) * Math.PI * 1.42 + 0.25));
    const y = inGalacticBand
      ? galacticCenter + gaussian(random) * height * 0.12
      : random() * height;
    const bright = random() > 0.987;
    const r = bright ? 0.85 + random() * 1.25 : 0.18 + Math.pow(random(), 3.1) * 0.93;
    const tone = STAR_TONES[Math.floor(random() * STAR_TONES.length)];

    stars.push({
      x,
      y,
      z: 0.15 + random() * 0.85,
      r,
      color: tone,
      alpha: 0.19 + Math.pow(random(), 1.6) * (bright ? 0.72 : 0.45),
      phase: random() * Math.PI * 2,
      frequency: 0.25 + random() * 1.1,
      bright,
    });
  }

  return stars;
}

function paintNebula(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width * 0.72));
  canvas.height = Math.max(1, Math.ceil(height * 0.72));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const sx = canvas.width / Math.max(width, 1);
  const sy = canvas.height / Math.max(height, 1);
  ctx.scale(sx, sy);
  ctx.clearRect(0, 0, width, height);

  // Broad, low-saturation gas clouds: overlapping gradients rather than uniform neon fog.
  const clouds = [
    { x: 0.12, y: 0.24, rx: 0.33, ry: 0.27, color: '48,81,154', a: 0.14 },
    { x: 0.31, y: 0.52, rx: 0.38, ry: 0.32, color: '91,59,129', a: 0.12 },
    { x: 0.54, y: 0.43, rx: 0.39, ry: 0.26, color: '37,96,143', a: 0.13 },
    { x: 0.76, y: 0.65, rx: 0.31, ry: 0.32, color: '133,72,76', a: 0.08 },
    { x: 0.91, y: 0.18, rx: 0.25, ry: 0.26, color: '55,73,140', a: 0.1 },
    { x: 0.43, y: 0.86, rx: 0.34, ry: 0.22, color: '38,69,118', a: 0.08 },
  ];

  ctx.save();
  ctx.filter = 'blur(48px)';
  clouds.forEach((cloud) => {
    const x = cloud.x * width;
    const y = cloud.y * height;
    const rx = cloud.rx * width;
    const ry = cloud.ry * height;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    gradient.addColorStop(0, `rgba(${cloud.color}, ${cloud.a})`);
    gradient.addColorStop(0.38, `rgba(${cloud.color}, ${cloud.a * 0.56})`);
    gradient.addColorStop(1, `rgba(${cloud.color}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.45, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // A faint diagonal Milky-Way band, interrupted by a dark dust lane.
  ctx.save();
  ctx.translate(width * 0.49, height * 0.48);
  ctx.rotate(-0.27);
  const band = ctx.createLinearGradient(-width * 0.8, 0, width * 0.8, 0);
  band.addColorStop(0, 'rgba(83,110,166,0)');
  band.addColorStop(0.22, 'rgba(102,125,171,0.025)');
  band.addColorStop(0.5, 'rgba(164,154,173,0.055)');
  band.addColorStop(0.75, 'rgba(102,124,170,0.028)');
  band.addColorStop(1, 'rgba(83,110,166,0)');
  ctx.fillStyle = band;
  ctx.fillRect(-width, -height * 0.15, width * 2, height * 0.3);
  ctx.filter = 'blur(30px)';
  ctx.fillStyle = 'rgba(3, 5, 14, 0.4)';
  ctx.beginPath();
  ctx.moveTo(-width, -height * 0.01);
  ctx.bezierCurveTo(-width * 0.4, -height * 0.1, width * 0.25, height * 0.13, width, height * 0.015);
  ctx.lineTo(width, height * 0.075);
  ctx.bezierCurveTo(width * 0.17, height * 0.2, -width * 0.4, height * 0.015, -width, height * 0.06);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Fine grain gives the fog a less vector-perfect surface.
  const random = randomSource(7719);
  for (let i = 0; i < Math.min(720, Math.floor((width * height) / 1800)); i += 1) {
    const x = random() * width;
    const y = random() * height;
    const r = 0.25 + random() * 0.7;
    ctx.fillStyle = `rgba(${random() > 0.5 ? '160,181,220' : '154,119,167'}, ${random() * 0.045})`;
    ctx.fillRect(x, y, r, r);
  }

  return canvas;
}

export default function Starfield({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    const trailCanvas = trailCanvasRef.current;
    const trailCtx = trailCanvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx || !trailCanvas || !trailCtx) return undefined;
    const trailContext: CanvasRenderingContext2D = trailCtx;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = reducedQuery.matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let nebula: HTMLCanvasElement | null = null;
    let frame = 0;
    let pointer = { x: -1000, y: -1000, nx: 0, ny: 0 };
    const ripples: Ripple[] = [];
    const trailPoints: TrailPoint[] = [];
    const trailSparks: TrailSpark[] = [];
    const trailColors = ['139,233,246', '198,166,255', '240,206,145', '224,241,255'];
    let lastTrailPointer: TrailPoint | null = null;
    let lastTime = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.35 : 1.8);
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      trailCanvas.width = Math.ceil(width * dpr);
      trailCanvas.height = Math.ceil(height * dpr);
      trailCanvas.style.width = `${width}px`;
      trailCanvas.style.height = `${height}px`;
      stars = makeStars(width, height);
      nebula = paintNebula(width, height);
      draw(performance.now(), false);
    };

    const drawStar = (star: Star, time: number, px: number, py: number) => {
      const x = star.x + px * (1 - star.z) * 15;
      const y = star.y + py * (1 - star.z) * 15;
      const distance = Math.hypot(x - pointer.x, y - pointer.y);
      const hover = distance < 112 ? (1 - distance / 112) : 0;
      const twinkle = reducedMotion || !enabled ? 0 : Math.sin(time * 0.0007 * star.frequency + star.phase) * 0.075;
      const alpha = Math.max(0.05, Math.min(1, star.alpha + twinkle + hover * 0.42));
      const radius = star.r + hover * (star.bright ? 1.1 : 0.3);

      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = `rgb(${star.color})`;
      if (star.bright || hover > 0.6) {
        const glow = ctx!.createRadialGradient(x, y, 0, x, y, radius * (star.bright ? 8 : 5));
        glow.addColorStop(0, `rgba(${star.color}, ${0.34 + hover * 0.35})`);
        glow.addColorStop(0.22, `rgba(${star.color}, ${0.1 + hover * 0.1})`);
        glow.addColorStop(1, `rgba(${star.color}, 0)`);
        ctx!.globalAlpha = alpha * 0.72;
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(x, y, radius * (star.bright ? 8 : 5), 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = `rgb(${star.color})`;
      ctx!.beginPath();
      ctx!.arc(x, y, radius, 0, Math.PI * 2);
      ctx!.fill();

      if (star.bright && star.r > 1.6) {
        const rayLength = radius * 4.2;
        ctx!.globalAlpha = alpha * 0.2;
        ctx!.strokeStyle = `rgb(${star.color})`;
        ctx!.lineWidth = 0.45;
        ctx!.beginPath();
        ctx!.moveTo(x - rayLength, y);
        ctx!.lineTo(x + rayLength, y);
        ctx!.moveTo(x, y - rayLength * 0.76);
        ctx!.lineTo(x, y + rayLength * 0.76);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    };

    function draw(time: number, allowLoop = true) {
      if (!ctx || !canvas) return;
      const delta = lastTime ? Math.min(time - lastTime, 60) : 16;
      lastTime = time;
      const px = reducedMotion || !enabled ? 0 : pointer.nx;
      const py = reducedMotion || !enabled ? 0 : pointer.ny;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (nebula) ctx.drawImage(nebula, 0, 0, width, height);

      stars.forEach((star) => drawStar(star, time, px, py));

      const activeRipples = ripples.filter((ripple) => time - ripple.start < 1250);
      ripples.splice(0, ripples.length, ...activeRipples);
      activeRipples.forEach((ripple) => {
        const progress = Math.max(0, (time - ripple.start) / 1250);
        const radius = progress * Math.max(width, height) * 0.16;
        ctx!.lineWidth = 1.2 - progress * 0.8;
        ctx!.strokeStyle = `rgba(168, 213, 255, ${Math.max(0, 0.3 * (1 - progress))})`;
        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.strokeStyle = `rgba(214, 190, 255, ${Math.max(0, 0.13 * (1 - progress))})`;
        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, radius * 0.58, 0, Math.PI * 2);
        ctx!.stroke();
      });

      trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      trailContext.clearRect(0, 0, width, height);
      if (enabled && !reducedMotion) {
        const livePoints = trailPoints.filter((point) => time - point.time < 420);
        trailPoints.splice(0, trailPoints.length, ...livePoints);
        for (let index = 1; index < trailPoints.length; index += 1) {
          const from = trailPoints[index - 1];
          const to = trailPoints[index];
          const age = Math.max(time - from.time, time - to.time);
          const fade = Math.max(0, 1 - age / 420);
          trailContext.globalAlpha = fade * 0.72;
          trailContext.strokeStyle = 'rgba(139, 233, 246, .82)';
          trailContext.lineWidth = 2.4 * fade;
          trailContext.lineCap = 'round';
          trailContext.shadowBlur = 11 * fade;
          trailContext.shadowColor = 'rgba(139, 233, 246, .8)';
          trailContext.beginPath();
          trailContext.moveTo(from.x, from.y);
          trailContext.lineTo(to.x, to.y);
          trailContext.stroke();
        }

        const liveSparks = trailSparks.filter((spark) => time - spark.start < spark.life);
        trailSparks.splice(0, trailSparks.length, ...liveSparks);
        liveSparks.forEach((spark) => {
          const progress = Math.max(0, (time - spark.start) / spark.life);
          const fade = Math.sin(Math.PI * progress) * (1 - progress * 0.35);
          const x = spark.x + spark.vx * progress * 18;
          const y = spark.y + spark.vy * progress * 18;
          const radius = spark.size * (1 - progress * 0.55);
          const glow = trailContext.createRadialGradient(x, y, 0, x, y, radius * 5);
          glow.addColorStop(0, `rgba(${spark.color}, ${0.85 * fade})`);
          glow.addColorStop(0.28, `rgba(${spark.color}, ${0.28 * fade})`);
          glow.addColorStop(1, `rgba(${spark.color}, 0)`);
          trailContext.globalAlpha = 1;
          trailContext.fillStyle = glow;
          trailContext.beginPath();
          trailContext.arc(x, y, radius * 5, 0, Math.PI * 2);
          trailContext.fill();
          trailContext.globalAlpha = fade;
          trailContext.fillStyle = `rgb(${spark.color})`;
          trailContext.beginPath();
          trailContext.arc(x, y, radius, 0, Math.PI * 2);
          trailContext.fill();
          if (spark.size > 1.35) {
            trailContext.strokeStyle = `rgba(${spark.color}, ${fade * 0.8})`;
            trailContext.lineWidth = 0.65;
            trailContext.beginPath();
            trailContext.moveTo(x - radius * 2.2, y);
            trailContext.lineTo(x + radius * 2.2, y);
            trailContext.moveTo(x, y - radius * 2.2);
            trailContext.lineTo(x, y + radius * 2.2);
            trailContext.stroke();
          }
        });
      }
      trailContext.globalAlpha = 1;
      trailContext.shadowBlur = 0;

      if (allowLoop && enabled && !reducedMotion && !document.hidden) {
        // Cap time influence on low-refresh or throttled devices; star motion remains intentionally subtle.
        void delta;
        frame = requestAnimationFrame((nextTime) => draw(nextTime, true));
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      pointer = {
        x: event.clientX,
        y: event.clientY,
        nx: (event.clientX / Math.max(width, 1) - 0.5) * 2,
        ny: (event.clientY / Math.max(height, 1) - 0.5) * 2,
      };
      if (enabled && !reducedMotion && event.pointerType !== 'touch') {
        const previous = lastTrailPointer;
        const current = { x: event.clientX, y: event.clientY, time: now };
        if (previous) {
          const dx = current.x - previous.x;
          const dy = current.y - previous.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 2) {
            const count = Math.min(5, Math.max(1, Math.floor(distance / 18)));
            for (let index = 1; index <= count; index += 1) {
              const ratio = index / count;
              trailPoints.push({ x: previous.x + dx * ratio, y: previous.y + dy * ratio, time: now });
            }
            const sparkCount = Math.min(4, Math.max(1, Math.floor(distance / 20)));
            for (let index = 0; index < sparkCount; index += 1) {
              const ratio = Math.random() * 0.8 + 0.1;
              trailSparks.push({
                x: previous.x + dx * ratio,
                y: previous.y + dy * ratio,
                vx: -dx / distance * (0.25 + Math.random() * 0.65) + (Math.random() - 0.5) * 0.8,
                vy: -dy / distance * (0.25 + Math.random() * 0.65) + (Math.random() - 0.5) * 0.8,
                start: now,
                life: 380 + Math.random() * 300,
                size: 0.8 + Math.random() * 1.45,
                color: trailColors[Math.floor(Math.random() * trailColors.length)],
              });
            }
            if (trailPoints.length > 90) trailPoints.splice(0, trailPoints.length - 90);
            if (trailSparks.length > 48) trailSparks.splice(0, trailSparks.length - 48);
          }
        }
        lastTrailPointer = current;
      }
      if (reducedMotion || !enabled) draw(performance.now(), false);
    };

    const onPointerLeave = () => {
      pointer = { x: -1000, y: -1000, nx: 0, ny: 0 };
      lastTrailPointer = null;
      if (reducedMotion || !enabled) draw(performance.now(), false);
    };

    const onClick = (event: MouseEvent) => {
      ripples.push({ x: event.clientX, y: event.clientY, start: performance.now() });
      if (ripples.length > 5) ripples.shift();
      if (reducedMotion || !enabled) draw(performance.now(), false);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      } else if (enabled && !reducedMotion) {
        frame = requestAnimationFrame((time) => draw(time, true));
      } else {
        draw(performance.now(), false);
      }
    };

    const onMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        trailPoints.length = 0;
        trailSparks.length = 0;
        lastTrailPointer = null;
      }
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      draw(performance.now(), enabled && !reducedMotion);
    };

    resize();
    if (enabled && !reducedMotion && !document.hidden) frame = requestAnimationFrame((time) => draw(time, true));
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVisibility);
    reducedQuery.addEventListener('change', onMotionPreference);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedQuery.removeEventListener('change', onMotionPreference);
    };
  }, [enabled]);

  return (
    <>
      <canvas ref={canvasRef} className="starfield-canvas" aria-hidden="true" />
      <canvas ref={trailCanvasRef} className="cursor-trail-canvas" aria-hidden="true" />
    </>
  );
}
