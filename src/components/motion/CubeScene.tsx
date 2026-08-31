import { useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   CUBE SCENE — the case-studies backdrop

   A glass cube with lit edges, a sparse particle field and a faint ground grid.
   Decorative only: everything the section says lives in HTML, and the canvas is
   `aria-hidden` with `pointer-events: none`, so it can never take a click,
   a caret or a tab stop.

   IT IS DRIVEN, NOT ANIMATED. The component exposes `setProgress(0..1)` and
   does no timeline of its own beyond a slow idle rotation. Scroll position is
   the only thing that moves it, which is what keeps the cube and the HTML on
   two independent tracks — the cube never participates in layout, and the
   content never waits on a 3D frame.

   POSITIONED ABSOLUTE, NOT FIXED. The brief asks for `position: fixed`. While
   ScrollTrigger pins the section the section itself is fixed, so an absolutely
   positioned child already covers exactly the viewport — and unlike a globally
   fixed canvas it cannot bleed over the sections above and below when the pin
   releases. Same result, contained.

   §31.7 — this is the second WebGL surface on the site and obeys the same five
   conditions: lazily imported, below the fold, off under reduced motion, off on
   low-power devices, and outside the entry bundle.
--------------------------------------------------------------------------- */

const PARTICLES_DESKTOP = 140;
const PARTICLES_SMALL = 50;

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

export interface CubeSceneProps {
  ref?: Ref<CubeHandle>;
  /** Light theme needs a much quieter cube than ink does. */
  dark: boolean;
  className?: string;
}

export function CubeScene({ ref, dark, className }: CubeSceneProps) {
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
        EdgesGeometry,
        LineSegments,
        LineBasicMaterial,
        MeshBasicMaterial,
        Mesh,
        BufferGeometry,
        BufferAttribute,
        PointsMaterial,
        Points,
        Color,
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

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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

      const accent = new Color(0x2f7bff);

      // -- the cube --------------------------------------------------------
      const group = new Group();

      const glass = new Mesh(
        new BoxGeometry(2.4, 2.4, 2.4),
        new MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: dark ? 0.14 : 0.07,
          depthWrite: false,
        }),
      );
      const edges = new LineSegments(
        new EdgesGeometry(new BoxGeometry(2.4, 2.4, 2.4)),
        new LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: dark ? 0.95 : 0.5,
        }),
      );
      // A second, larger shell reads as the soft bloom around the edges.
      const halo = new Mesh(
        new BoxGeometry(2.75, 2.75, 2.75),
        new MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: dark ? 0.05 : 0.025,
          depthWrite: false,
        }),
      );
      group.add(glass, edges, halo);
      scene.add(group);

      // -- particles -------------------------------------------------------
      const count = compact ? PARTICLES_SMALL : PARTICLES_DESKTOP;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      const dust = new BufferGeometry();
      dust.setAttribute('position', new BufferAttribute(positions, 3));
      const dustPoints = new Points(
        dust,
        new PointsMaterial({
          color: accent,
          size: 0.045,
          sizeAttenuation: true,
          transparent: true,
          opacity: dark ? 0.7 : 0.35,
          depthWrite: false,
        }),
      );
      scene.add(dustPoints);

      // -- ground grid, drawn as lines so it stays a few kilobytes ----------
      const gridPts: number[] = [];
      const span = 14;
      const step = 2;
      for (let i = -span; i <= span; i += step) {
        gridPts.push(-span, -3.4, i, span, -3.4, i);
        gridPts.push(i, -3.4, -span, i, -3.4, span);
      }
      const gridGeo = new BufferGeometry();
      gridGeo.setAttribute('position', new BufferAttribute(new Float32Array(gridPts), 3));
      const grid = new LineSegments(
        gridGeo,
        new LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: dark ? 0.16 : 0.08,
        }),
      );
      scene.add(grid);

      let raf = 0;
      let last = performance.now();

      const render = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        const t = progressRef.current;

        /*
          Two tracks, both read from the same scroll progress:
            · x travels from the right of the frame toward the centre
            · scale grows the whole way, so the cube keeps gaining presence
          The easing is deliberately gentle — the brief asks for cinematic, not
          snappy.
        */
        const startX = compact ? 1.4 : 3.4;
        group.position.x = startX * (1 - t);
        const scale = (compact ? 0.55 : 0.8) + t * (compact ? 1.1 : 2.2);
        group.scale.setScalar(scale);

        if (!reducedMotion) {
          group.rotation.y += dt * 0.16;
          group.rotation.x = Math.sin(now * 0.0002) * 0.16;
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
  }, [dark, reducedMotion]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ pointerEvents: 'none' }}
    />
  );
}
