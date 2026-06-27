import { useRef, useEffect } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_click;

#define PI 3.14159265359
#define GRID_SCALE 12.0
#define WAVE_SPEED 0.6

float line(float coord, float width) {
  float fw = fwidth(coord);
  float p = abs(fract(coord - 0.5) - 0.5);
  return 1.0 - smoothstep(width * fw, (width + 1.0) * fw, p);
}

float wave(vec2 p, float t, float mx, float my) {
  float d = length(p);
  float clickRipple = sin(d * 15.0 - t * 3.0) * exp(-d * 3.0) * u_click;
  return sin(p.x * 0.5 + t * 0.7 + mx * 2.0) * 0.18 + sin(p.y * 0.4 - t * 0.5 + my * 2.0 + clickRipple) * 0.18;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
  vec2 mouseNorm = (u_mouse - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
  float t = u_time * WAVE_SPEED;
  float mx = mouseNorm.x * 0.5;
  float my = mouseNorm.y * 0.5;
  float mouseDist = length(uv - mouseNorm);
  vec2 gridUV = uv;
  gridUV.y += wave(gridUV, t, mx, my);
  gridUV.x += wave(gridUV + vec2(5.2, 1.3), t * 0.8, mx, my) * 0.6;
  float distortion = sin(gridUV.x * 3.0 + t + mouseDist * 4.0) * 0.04;
  distortion += sin(gridUV.y * 2.5 - t * 1.2 + mouseDist * 3.0) * 0.04;
  gridUV += distortion;
  float expansion = 1.0 + 0.05 * sin(t * 0.5) + mouseDist * 0.1;
  gridUV *= GRID_SCALE * expansion;
  float hLine = line(gridUV.x, 1.2);
  float vLine = line(gridUV.y, 1.2);
  float grid = max(hLine, vLine);
  float band = abs(fract(dot(gridUV, vec2(0.707, 0.707)) * 0.1 - t * 0.08) - 0.5) * 2.0;
  band = pow(band, 4.0);
  vec3 c1 = vec3(0.92, 0.96, 0.98);
  vec3 c2 = vec3(0.82, 0.88, 0.94);
  vec3 c3 = vec3(0.75, 0.80, 0.90);
  vec3 color = mix(c1, c2, band);
  float lineIntensity = 0.85 + 0.15 * sin(t + uv.x * 2.0);
  color = mix(color, c3, grid * lineIntensity);
  color += vec3(0.05, 0.1, 0.2) * (1.0 - smoothstep(0.0, 0.5, mouseDist));
  color += vec3(0.1, 0.15, 0.25) * exp(-mouseDist * mouseDist * 8.0) * 0.3;
  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function FluidWarpGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;
    gl.getExtension('OES_standard_derivatives');

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // Fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const aPositionLoc = gl.getAttribLocation(program, 'a_position');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uClickLoc = gl.getUniformLocation(program, 'u_click');

    gl.useProgram(program);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const mouse = { x: 0, y: 0 };
    let clickValue = 0;
    let animId = 0;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (rect.height - (e.clientY - rect.top)) * dpr;
    };

    const onClick = () => {
      clickValue = 1.0;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    function render(time: number) {
      if (!gl || !canvas) return;
      const t = time * 0.001;

      clickValue *= 0.98;
      if (clickValue < 0.001) clickValue = 0;

      gl.uniform1f(uTimeLoc, t);
      gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(uClickLoc, clickValue);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
