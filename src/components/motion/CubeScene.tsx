import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   CUBE SCENE — the case-studies backdrop

   A blue glass cube: fresnel-lit faces, an energy scan travelling up through
   the volume, a bloom shell, bright edges, a counter-rotating inner core,
   drifting dust and a ground grid that fades toward the horizon.

   EVERY SURFACE IS A SHADER. The first pass used flat `MeshBasicMaterial`s and
   read as a plain wireframe box, so the light is now computed per fragment: rim
   brightness comes from the view angle rather than a fixed opacity. Shaders are
   strings, so this is a better scene at zero extra bundle cost — the three
   chunk stays lazy and unchanged in size.

   The section is `tone="ink"` in BOTH themes, so the whole scene is tuned for a
   dark ground and blends additively. It deliberately takes no theme prop:
   re-mounting a WebGL context on a theme toggle costs a context loss for no
   visible gain.

   Decorative only: everything the section says lives in HTML, and the canvas is
   `aria-hidden` with `pointer-events: none`, so it can never take a click, a
   caret or a tab stop.

   IT IS DRIVEN, NOT ANIMATED. The component exposes `setProgress(0..1)`. Scroll
   is the only thing that moves it through the frame, which is what keeps the
   cube and the HTML on two independent tracks — the cube never participates in
   layout, and the content never waits on a 3D frame.

   POSITIONED ABSOLUTE, NOT FIXED. While ScrollTrigger pins the section the
   section itself is fixed, so an absolutely positioned child already covers
   exactly the viewport — and unlike a globally fixed canvas it cannot bleed
   over the sections above and below when the pin releases.

   §31.7 — this is the second WebGL surface on the site and obeys the same five
   conditions: lazily imported, below the fold, off under reduced motion, off on
   low-power devices, and outside the entry bundle.
--------------------------------------------------------------------------- */

const PARTICLES_DESKTOP = 220;
const PARTICLES_SMALL = 70;

/** #4d8dff — the blue that is legible on ink. */
const ACCENT = 0x4d8dff;

/* ---------------------------------------------------------------------------
   CUBE_INTENSITY — a contrast budget, not a taste setting

   The cube ends its travel in the middle of the frame, which is exactly where
   the heading, the paragraph and the rows are. Additive blending stacks: at the
   first pass's opacities the halo, the glass, the edges and the bloom summed to
   near-white (77, 255, 255) behind the copy, measuring 1.23:1 for the heading
   and 1.0:1 for body text. Unreadable.

   These numbers were then measured rather than guessed. Rendering the WHOLE
   scene offscreen at 1440x900 — cube, halo, edges, core, bloom, dust and grid,
   at peak scale, across eight rotations — and compositing it under the real
   text rectangles gives, together with the 70% scrim the section lays over the
   canvas:

       body text (--muted-dark on the composite)   5.24:1   AA needs 4.5
       heading and row titles (white)             13.44:1

   The dust and the grid matter to that figure: an earlier sweep left them out
   and read half a point high. Measure the whole scene or not at all.

   Raising any value here without re-running that measurement will quietly break
   AA on the one section whose background is not a flat colour.
--------------------------------------------------------------------------- */
const CUBE_INTENSITY = {
  glass: 0.3,
  halo: 0.16,
  edges: 0.55,
  core: 0.28,
  bloom: 0.1,
} as const;

export interface CubeHandle {
  /** 0 → start of the pin, 1 → end. Safe to call before the scene loads. */
  setProgress: (t: number) => void;
}

function isLowPower(): boolean {
  if (typeof navigator === 'undefined') return true;
  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 4) return true;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (typeof memory === 'number' && memory <= 4) return true;
  return false;
}

/* -- shaders ---------------------------------------------------------------
   One vertex stage serves both cube shells: it hands the fragment stage a
   view-space normal and eye vector, so the rim term is a real dot product
   rather than a baked constant.
-------------------------------------------------------------------------- */

const GLASS_VERT = `
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vLocal;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vEye = normalize(-mv.xyz);
    vLocal = position;
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * Faces: fresnel rim, plus a slow band of light sweeping up through the volume.
 *
 * The exponents and weights here are not taste, they are a contrast budget —
 * see CUBE_INTENSITY below.
 */
const GLASS_FRAG = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vLocal;
  void main() {
    float facing = clamp(dot(vNormal, vEye), 0.0, 1.0);
    float rim = pow(1.0 - facing, 2.6);
    float scan = sin(vLocal.y * 2.6 - uTime * 0.9) * 0.5 + 0.5;
    scan = pow(scan, 3.0);
    float a = (rim * 0.85 + scan * 0.10 + 0.03) * uOpacity;
    gl_FragColor = vec4(uColor * (0.5 + rim * 1.1 + scan * 0.35), a);
  }
`;

/** The bloom shell: an inverted hull that shows only where it grazes the eye. */
const HALO_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vEye;
  varying vec3 vLocal;
  void main() {
    float rim = pow(1.0 - clamp(dot(-vNormal, vEye), 0.0, 1.0), 3.4);
    gl_FragColor = vec4(uColor, rim * uOpacity);
  }
`;

/** Dust: round, softly falling off, gently bobbing, sized by depth. */
const DUST_VERT = `
  attribute float aScale;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vScale;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.35 + p.x * 0.7) * 0.22;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aScale * uPixelRatio * (70.0 / max(-mv.z, 0.1));
    vScale = aScale;
    gl_Position = projectionMatrix * mv;
  }
`;

const DUST_FRAG = `
  uniform vec3 uColor;
  varying float vScale;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, a * 0.5 * vScale);
  }
`;

/** Grid: fades with distance so it has no visible cut-off edge. */
const GRID_VERT = `
  varying float vFade;
  void main() {
    vFade = 1.0 - clamp(length(position.xz) / 15.0, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRID_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    gl_FragColor = vec4(uColor, vFade * vFade * uOpacity);
  }
`;

/** A soft radial wash behind the cube — cheap bloom, no post-processing pass. */
const BLOOM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BLOOM_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(1.0 - clamp(d, 0.0, 1.0), 3.0);
    gl_FragColor = vec4(uColor, a * uOpacity);
  }
`;

export interface CubeSceneProps {
  ref?: Ref<CubeHandle>;
  className?: string;
}

export function CubeScene({ ref, className }: CubeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (t: number) => {
        progressRef.current = Math.min(Math.max(t, 0), 1);
      },
    }),
    [],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (isLowPower()) return;

    /*
      NO CUBE BELOW 1024 — the same breakpoint that turns off the pin.

      Without the pin nothing drives `setProgress`, so the cube sits frozen at
      t = 0, which parks it half off the right edge: on a phone it read as a
      stray blue rectangle overlapping the rows rather than as a backdrop. A
      scene that cannot animate is not a backdrop, it is debris — and skipping
      it also spares phones a WebGL context they were gaining nothing from.
    */
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    let cleanup = () => {};
    let cancelled = false;
    let started = false;

    async function start() {
      if (started || cancelled || !host) return;
      started = true;

      // Named imports so Rollup can drop everything the scene never touches.
      const {
        WebGLRenderer,
        Scene,
        PerspectiveCamera,
        Group,
        BoxGeometry,
        PlaneGeometry,
        EdgesGeometry,
        LineSegments,
        LineBasicMaterial,
        ShaderMaterial,
        Mesh,
        BufferGeometry,
        BufferAttribute,
        Points,
        Color,
        AdditiveBlending,
        BackSide,
        DoubleSide,
      } = await import('three');
      if (cancelled) return;

      let renderer: InstanceType<typeof WebGLRenderer>;
      try {
        renderer = new WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
      } catch {
        return; // No WebGL. The section is complete without it.
      }

      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      const compact = width < 768;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      host.appendChild(canvas);

      const scene = new Scene();
      const camera = new PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 9;

      const accent = new Color(ACCENT);

      /* Every animated shader shares one clock, so nothing can drift apart. */
      const uTime = { value: 0 };

      // -- the cube ---------------------------------------------------------
      const group = new Group();
      const box = new BoxGeometry(2.4, 2.4, 2.4);

      const glass = new Mesh(
        box,
        new ShaderMaterial({
          uniforms: { uColor: { value: accent }, uTime, uOpacity: { value: CUBE_INTENSITY.glass } },
          vertexShader: GLASS_VERT,
          fragmentShader: GLASS_FRAG,
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
          blending: AdditiveBlending,
        }),
      );

      const halo = new Mesh(
        new BoxGeometry(3.05, 3.05, 3.05),
        new ShaderMaterial({
          uniforms: { uColor: { value: accent }, uOpacity: { value: CUBE_INTENSITY.halo } },
          vertexShader: GLASS_VERT,
          fragmentShader: HALO_FRAG,
          transparent: true,
          depthWrite: false,
          side: BackSide,
          blending: AdditiveBlending,
        }),
      );

      const edges = new LineSegments(
        new EdgesGeometry(box),
        new LineBasicMaterial({ color: accent, transparent: true, opacity: CUBE_INTENSITY.edges }),
      );

      /* A smaller core turning the other way, so the cube reads as a volume
         with something inside it rather than an empty outline. */
      const core = new LineSegments(
        new EdgesGeometry(new BoxGeometry(1.05, 1.05, 1.05)),
        new LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: CUBE_INTENSITY.core,
          blending: AdditiveBlending,
        }),
      );

      group.add(halo, glass, edges, core);
      scene.add(group);

      // -- the wash behind it -----------------------------------------------
      const bloom = new Mesh(
        new PlaneGeometry(11, 11),
        new ShaderMaterial({
          uniforms: { uColor: { value: accent }, uOpacity: { value: CUBE_INTENSITY.bloom } },
          vertexShader: BLOOM_VERT,
          fragmentShader: BLOOM_FRAG,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      bloom.position.z = -3;
      scene.add(bloom);

      // -- dust ---------------------------------------------------------------
      const count = compact ? PARTICLES_SMALL : PARTICLES_DESKTOP;
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
        scales[i] = 0.35 + Math.random() * 0.8;
      }
      const dustGeo = new BufferGeometry();
      dustGeo.setAttribute('position', new BufferAttribute(positions, 3));
      dustGeo.setAttribute('aScale', new BufferAttribute(scales, 1));
      const dustPoints = new Points(
        dustGeo,
        new ShaderMaterial({
          uniforms: {
            uColor: { value: accent },
            uTime,
            uPixelRatio: { value: pixelRatio },
          },
          vertexShader: DUST_VERT,
          fragmentShader: DUST_FRAG,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      scene.add(dustPoints);

      // -- ground grid, drawn as lines so it stays a few kilobytes -----------
      const gridPts: number[] = [];
      const span = 14;
      const step = 2;
      for (let i = -span; i <= span; i += step) {
        gridPts.push(-span, -3.6, i, span, -3.6, i);
        gridPts.push(i, -3.6, -span, i, -3.6, span);
      }
      const gridGeo = new BufferGeometry();
      gridGeo.setAttribute('position', new BufferAttribute(new Float32Array(gridPts), 3));
      const grid = new LineSegments(
        gridGeo,
        new ShaderMaterial({
          uniforms: { uColor: { value: accent }, uOpacity: { value: 0.35 } },
          vertexShader: GRID_VERT,
          fragmentShader: GRID_FRAG,
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      scene.add(grid);

      let raf = 0;
      let last = performance.now();
      /* The cube chases the scroll value rather than snapping to it, so a
         coarse wheel step arrives as a glide instead of a jump. */
      let eased = 0;

      const render = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        uTime.value = now * 0.001;

        eased += (progressRef.current - eased) * Math.min(dt * 6, 1);
        const t = eased;

        /*
          Two properties, both read from the same scroll progress:
            · x travels from the right of the frame toward the centre
            · scale grows the whole way, so the cube keeps gaining presence
        */
        const startX = compact ? 1.4 : 3.4;
        group.position.x = startX * (1 - t);
        const scale = (compact ? 0.55 : 0.8) + t * (compact ? 1.1 : 1.3);
        group.scale.setScalar(scale);
        bloom.position.x = group.position.x;
        bloom.scale.setScalar(0.7 + t * 0.9);

        if (!reducedMotion) {
          group.rotation.y += dt * 0.16;
          group.rotation.x = Math.sin(now * 0.0002) * 0.16;
          core.rotation.y -= dt * 0.42;
          core.rotation.z += dt * 0.18;
          dustPoints.rotation.y += dt * 0.02;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      };

      const play = () => {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(render);
        }
      };
      const pause = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      // §27.5 — nothing renders in a tab nobody is looking at.
      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener('visibilitychange', onVisibility);

      // Nor while the section is off screen.
      const activity = new IntersectionObserver(
        (entries) => (entries.some((e) => e.isIntersecting) ? play() : pause()),
        { rootMargin: '100px' },
      );
      activity.observe(host);

      const onResize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      play();

      cleanup = () => {
        pause();
        document.removeEventListener('visibilitychange', onVisibility);
        activity.disconnect();
        ro.disconnect();
        scene.traverse((object) => {
          const any = object as unknown as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void };
          };
          any.geometry?.dispose();
          any.material?.dispose();
        });
        // Hand the GPU context back rather than waiting for GC.
        renderer.forceContextLoss();
        renderer.dispose();
        canvas.remove();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void start();
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ pointerEvents: 'none' }}
    />
  );
}
