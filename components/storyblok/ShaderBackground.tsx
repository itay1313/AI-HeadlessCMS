"use client";

import { useEffect, useRef } from "react";

// Lightweight WebGL fragment shader: flowing indigo/violet plasma on a dark
// base. Stays dark toward the edges so overlaid text keeps AAA contrast.
// No external deps. Respects prefers-reduced-motion (renders one static frame).

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv - 0.5;
  p.x *= u_res.x / u_res.y;

  float t = u_time * 0.08;

  // layered flowing waves
  float v = 0.0;
  v += sin((p.x * 3.0) + t);
  v += sin((p.y * 3.5) - t * 1.1);
  v += sin((p.x + p.y) * 2.5 + t * 0.8);
  v += sin(length(p) * 6.0 - t * 1.4);

  float r = length(p * 1.35);

  vec3 ink    = vec3(0.039, 0.039, 0.059); // #0a0a0f
  vec3 indigo = vec3(0.26, 0.22, 0.62);
  vec3 violet = vec3(0.52, 0.24, 0.72);

  vec3 glow = mix(indigo, violet, 0.5 + 0.5 * sin(v + t));
  // fade glow toward edges -> dark frame keeps text readable
  float center = smoothstep(1.25, 0.0, r);
  vec3 col = mix(ink, glow, 0.42 * center);

  // subtle film grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export default function ShaderBackground({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(start);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
