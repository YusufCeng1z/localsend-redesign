"use client";

// Adapted from Originkit "Predictive Arc 4": a dot grid lit as a stack of nested arches, a brightness pulse rolling
// outward through the stack, and the inner arches leaning further toward the pointer than the outer ones.
// Kept from the original: the per-cell shader, the arch geometry, the pulse and the lean. Changed for this site:
// transparent background so the page colour shows through, theme-aware ink, pointer tracked on the window because
// the canvas sits behind content, the loop pauses when off screen, and reduced motion draws one still frame.
import { useEffect, useRef } from "react";

const MAX_DPR = 1.5;

// Preset values of the original: Count 5, Gap 9, Height 70, Thickness 100, Density 160, Dot size 100, Speed 50, Hover 31.
const COUNT = 5;
const GAP = 0.09;
const ARCH_HEIGHT = 0.7;
const THICKNESS = 1;
const DENSITY = 160;
const DOT_SIZE = 1;
const SPEED = 1;
const HOVER = 0.31;

const INK = {
  dark: { base: [0.12, 0.42, 0.4], accent: [0.18, 0.78, 0.72], high: [0.85, 1, 0.97], alpha: 0.55 },
  light: { base: [0.55, 0.82, 0.79], accent: [0.04, 0.48, 0.44], high: [0.02, 0.3, 0.27], alpha: 0.5 },
} as const;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uDpr, uCell, uDot, uHover, uAlpha;
uniform vec2  uPtr;   // CSS px, y measured from the top
uniform float uA, uB, uC, uD; // count, gap, height, thickness
uniform vec3  uBase, uAccent, uHigh;

void main(){
  float cs = max(uCell, 2.0);
  vec2 ci = floor(gl_FragCoord.xy / cs);
  vec2 cc = (ci + 0.5) * cs;

  float x = cc.x / uDpr;
  float y = (uRes.y - cc.y) / uDpr;
  float w = uRes.x / uDpr;
  float h = uRes.y / uDpr;
  float t = uTime;

  float i = 0.0;
  float leanX = (uPtr.x - w * 0.5) * 0.5 * uHover;
  float leanY = (uPtr.y - h * 0.5) * 0.25 * uHover;
  float n1 = max(uA, 1.0);
  for (int n = 0; n < 8; n++) {
    float fn = float(n);
    if (fn >= n1) break;
    float par = 1.0 - 0.6 * fn / n1;
    float cx = w * 0.5 + leanX * par;
    float normX = (x - cx) / (w * 0.75);
    float curveY = h * 0.3 + fn * h * uB + leanY * par
                 + normX * normX * h * uC * (1.0 + 0.08 * fn);
    float th = (40.0 + (1.0 - min(abs(normX), 1.0)) * 25.0) * uD;
    float dist = abs(y - curveY);
    if (dist < th) {
      float b = 1.0 - dist / th;
      float waveX = sin(x * 0.015 + t);
      float waveY = cos(y * 0.02 + t);
      b = b * 0.7 + waveX * waveY * 0.3 * b;
      b *= max(0.0, 1.0 - pow(abs(normX), 2.5));
      b *= 0.45 + 0.55 * (0.5 + 0.5 * sin(t * 1.5 - fn * 0.9));
      i = max(i, b);
    }
  }

  if (i <= 0.02) { gl_FragColor = vec4(0.0); return; }
  float side = uDot * i * uDpr;
  vec2 d = abs(gl_FragCoord.xy - cc);
  float cov = 1.0 - smoothstep(side * 0.5 - 1.0, side * 0.5 + 1.0, max(d.x, d.y));
  vec3 ink = mix(uBase, uAccent, clamp(pow(i, 1.1), 0.0, 1.0));
  ink = mix(ink, uHigh, smoothstep(0.72, 1.0, i));
  float a = cov * clamp(i * 1.6, 0.0, 1.0) * uAlpha;
  gl_FragColor = vec4(ink * a, a);
}
`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function ArchField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uDpr = u("uDpr"), uCell = u("uCell"), uDot = u("uDot"), uAlpha = u("uAlpha");
    const uPtr = u("uPtr"), uBase = u("uBase"), uAccent = u("uAccent"), uHigh = u("uHigh");
    gl.uniform1f(u("uA"), COUNT);
    gl.uniform1f(u("uB"), GAP);
    gl.uniform1f(u("uC"), ARCH_HEIGHT);
    gl.uniform1f(u("uD"), THICKNESS);
    gl.uniform1f(u("uHover"), HOVER);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ptr = { tx: 0.5, ty: 0.5, x: 0.5, y: 0.5 };
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let clock = 2.2;

    const ink = () => {
      const t = INK[document.documentElement.dataset.theme === "light" ? "light" : "dark"];
      gl.uniform3fv(uBase, t.base);
      gl.uniform3fv(uAccent, t.accent);
      gl.uniform3fv(uHigh, t.high);
      gl.uniform1f(uAlpha, t.alpha);
    };
    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      const bw = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const bh = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);
      // Density is cells down the short edge, so the grain holds when the frame changes aspect.
      const pitch = Math.min(bw, bh) / dpr / DENSITY;
      gl.uniform2f(uRes, bw, bh);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uTime, clock);
      gl.uniform1f(uCell, Math.max(2, pitch * dpr));
      gl.uniform1f(uDot, pitch * 1.2 * DOT_SIZE);
      gl.uniform2f(uPtr, ptr.x * (bw / dpr), ptr.y * (bh / dpr));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock = (clock + dt * 0.9 * SPEED) % 6283;
      const k = 1 - Math.exp(-dt * 6);
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (reduce) return draw();
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptr.tx = clamp01((e.clientX - r.left) / r.width);
      ptr.ty = clamp01((e.clientY - r.top) / r.height);
    };

    ink();
    run();
    const ro = new ResizeObserver(() => { if (reduce) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; run(); });
    io.observe(canvas);
    const mo = new MutationObserver(() => { ink(); if (reduce) draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", run);
    addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", run);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${className}`} />;
}
