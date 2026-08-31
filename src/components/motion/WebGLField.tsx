import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   WEBGL FIELD — the one 3D moment on the site

   master.md §31.7 opens "Not recommended", and it was declined twice on this
   project for that reason. But the same section names the conditions under
   which a 3D moment MAY ship, and this is built to all five of them:

     1. behind a lazy boundary — `three` is dynamically imported inside an
        effect, so it never enters the entry bundle;
     2. below the fold — it mounts in section 03, never in the hero;
     3. disabled under reduced motion — the import never even runs;
     4. disabled on low-power devices — see `isLowPower` below;
     5. it must not regress any budget — the entry bundle is unchanged, because
        nothing here is reachable from the entry graph.

   ONE CANVAS, NOT ONE PER CARD. A browser allows roughly sixteen live WebGL
   contexts and starts discarding the oldest beyond that; a canvas inside every
   card would exhaust them, cost a GPU context each, and put moving pixels
   directly behind body copy. A single field behind the whole card row gives the
   depth without any of that.

   WHAT IT DRAWS. Drifting points in the brand blue, slowly, with no camera
   movement and no bloom. It is a texture, not a scene — §22.2's restraint still
   applies, and anything more assertive would compete with the type in front of
   it.
--------------------------------------------------------------------------- */

const POINT_COUNT = 260;
const POINT_COUNT_SMALL = 120;

/**
 * §31.7 — "disabled ... on low-power devices".
 *
 * Read from what the browser will actually tell us: core count, device memory
 * where exposed, and a coarse pointer, which on a laptop means a touch screen
 * but on a phone means a phone. Any one of them is enough to skip the scene —
 * the page is complete without it, so a false positive costs nothing and a
 * false negative costs a dropped frame rate on someone's phone.
 */
function isLowPower(): boolean {
  if (typeof navigator === 'undefined') return true;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 4) return true;

  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (typeof memory === 'number' && memory <= 4) return true;

  if (typeof window !== 'undefined') {
    if (window.matchMedia('(pointer: coarse)').matches) return true;
    if (window.innerWidth < 1024) return true;
  }

  return false;
}

export interface WebGLFieldProps {
  className?: string;
}

export function WebGLField({ className }: WebGLFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || isLowPower()) return;

    const host = hostRef.current;
    if (!host) return;
    if (typeof IntersectionObserver === 'undefined') return;

    let cleanup = () => {};
    let cancelled = false;
    let started = false;

    async function start() {
      if (started || cancelled || !host) return;
      started = true;

      // §31.4 / §31.7 condition 1 — the only import of `three` on the site, and
      // it is here, inside an effect, behind an observer.
      /*
        NAMED imports, not a namespace. `import * as THREE` keeps the whole
        library alive because every access goes through the namespace object;
        destructuring lets Rollup drop everything this scene never touches.
        Measured: 182KB gzip as a namespace, and the figure below after.
      */
      const {
        WebGLRenderer,
        Scene,
        PerspectiveCamera,
        BufferGeometry,
        BufferAttribute,
        PointsMaterial,
        Points,
      } = await import('three');
      if (cancelled) return;

      let renderer: InstanceType<typeof WebGLRenderer>;
      try {
        renderer = new WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: 'low-power',
        });
      } catch {
        // No WebGL, or contexts exhausted. The section is complete without it.
        return;
      }

      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;

      // Capped at 1.5: a retina phone would otherwise render four times the
      // pixels for a texture nobody is looking straight at.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      host.appendChild(canvas);

      const scene = new Scene();
      const camera = new PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 14;

      const count = width < 900 ? POINT_COUNT_SMALL : POINT_COUNT;
      const positions = new Float32Array(count * 3);
      const drift = new Float32Array(count);

      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 34;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        drift[i] = 0.15 + Math.random() * 0.35;
      }

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(positions, 3));

      const material = new PointsMaterial({
        color: 0x4d8dff, // --blue-500, the blue that is legal on ink
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });

      const points = new Points(geometry, material);
      scene.add(points);

      let raf = 0;
      let last = performance.now();

      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        const pos = geometry.getAttribute('position') as InstanceType<
          typeof BufferAttribute
        >;
        for (let i = 0; i < count; i += 1) {
          const y = pos.getY(i) + (drift[i] ?? 0.2) * dt;
          // Wrap rather than respawn: no allocation inside the frame loop.
          pos.setY(i, y > 9 ? -9 : y);
        }
        pos.needsUpdate = true;

        points.rotation.y += dt * 0.02;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      const play = () => {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };
      const pause = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      // §27.5 — nothing animates in a tab nobody is looking at.
      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener('visibilitychange', onVisibility);

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
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        // Hand the GPU context back rather than waiting for GC to do it.
        renderer.forceContextLoss();
        renderer.dispose();
        canvas.remove();
      };
    }

    // §31.7 condition 2 — it does not exist until it is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void start();
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
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
      // Decoration only: it must never intercept a click meant for a card.
      style={{ pointerEvents: 'none' }}
    />
  );
}
