// Liquid shader background, ported from the hero on freeplaystudios.com.
// Same fragment shader and uniform values as the original <shader-art> element,
// without the skypack dependency. `time` is seconds since the animation started.
(() => {
  const canvas = document.querySelector(".work__shader");
  if (!canvas) return;
  const section = canvas.parentElement;

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  const VERT = `
    precision highp float;
    attribute vec4 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = position;
    }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform float time;
    uniform float scale;
    uniform vec2 resolution;
    uniform vec3 color1, color2, color3, color4;
    uniform float ax, ay, az, aw;
    uniform float bx, by;

    // just a bunch of sin & cos to generate an interesting pattern
    float cheapNoise(vec3 stp) {
      vec3 p = vec3(stp.st, stp.p);
      vec4 a = vec4(ax, ay, az, aw);
      return mix(
        sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) *
        cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
        sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) *
        cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)),
        .436
      );
    }

    void main() {
      vec2 aR = vec2(resolution.x / resolution.y, 1.);
      vec2 st = vUv * aR * scale;
      float S = sin(time * .005);
      float C = cos(time * .005);
      vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
      vec2 v2 = vec2(
        cheapNoise(vec3(st + bx * v1 + vec2(C * 1.7, S * 9.2), 0.15 * time)),
        cheapNoise(vec3(st + by * v1 + vec2(S * 8.3, C * 2.8), 0.126 * time))
      );
      float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));

      vec3 color = mix(color1, color2, clamp((n * n) * 8., 0.0, 1.0));
      color = mix(color, color3, clamp(length(v1), 0.0, 1.0));
      color = mix(color, color4, clamp(length(v2.x), 0.0, 1.0));
      color /= n * n + n * 7.;
      gl_FragColor = vec4(color, 1.);
    }`;

  const compile = (type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
  } catch (err) {
    console.warn("shader-bg: falling back to static background", err);
    return;
  }
  gl.useProgram(program);

  // Two triangles covering the screen, uv flipped vertically like the original
  const buffer = (name, size, data) => {
    const loc = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  buffer("position", 2, [-1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1]);
  buffer("uv", 2, [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]);

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const uniforms = {
    scale: 0.15,
    ax: 5, ay: 7, az: 9, aw: 13,
    bx: 1, by: 1,
  };
  for (const [name, value] of Object.entries(uniforms)) {
    gl.uniform1f(gl.getUniformLocation(program, name), value);
  }
  gl.uniform3fv(gl.getUniformLocation(program, "color1"), hex("#c8001c"));
  gl.uniform3fv(gl.getUniformLocation(program, "color2"), hex("#c8001c"));
  gl.uniform3fv(gl.getUniformLocation(program, "color3"), hex("#121212"));
  gl.uniform3fv(gl.getUniformLocation(program, "color4"), hex("#121212"));

  const timeLoc = gl.getUniformLocation(program, "time");
  const resLoc = gl.getUniformLocation(program, "resolution");

  // Render at 1x device pixels, as the original does
  const resize = () => {
    canvas.width = Math.max(1, canvas.clientWidth);
    canvas.height = Math.max(1, canvas.clientHeight);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(resLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
    draw();
  };

  let elapsed = 0;
  let last = 0;
  let frame = 0;

  function draw() {
    gl.uniform1f(timeLoc, elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // The layer can be on screen but still fully transparent; skip drawing until it shows
  const isVisible = () => parseFloat(getComputedStyle(section).opacity) > 0.01;

  function loop(now) {
    elapsed += (now - last) / 1000;
    last = now;
    if (isVisible()) draw();
    frame = requestAnimationFrame(loop);
  }

  const play = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  };

  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  resize();
  section.classList.add("has-shader");
  new ResizeObserver(resize).observe(canvas);

  // Only animate while the section is on screen
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !reducedMotion.matches) play();
    else pause();
  }).observe(section);
})();
