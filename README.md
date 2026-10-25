# MASSI — The art of becoming

Independent, unsolicited cinematic website concept for **Salon Massi, Hamburg**. Local only: no deployment, hosting, domain, backend, account system, payments or paid APIs.

**Testing limitation:** the available browser has no WebGL2 context. The running fallback, desktop/mobile layouts and interactions were tested. The real Three.js room is implemented and compiled, but its rendering, reflections, camera journey and GPU performance were **not browser-verified**. Screenshots show the fallback, not the 3D room. Complete the GPU checks below before presenting the demo.

## Local installation

Install **Node.js 22.18+** (Node 24 LTS recommended; tested with 24.19.0). Unzip, open a terminal inside `massi`, and run:

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. Stop with Ctrl+C. The initial install needs npm internet access. Fonts and scene assets are local at runtime; no API keys or model downloads are required. External contact/source links load only when followed.

```sh
npm run build
npm start
```

Other checks:

```sh
npm run typecheck
npm run check:scene
```

The scene check audits 2,002 desktop/mobile camera positions against room bounds and major furniture footprints. It does not test rendering. A lockfile is included; `npm ci` gives a clean reproducible install. No npm script deploys anything.

## Experience and controls

1. Editorial introduction against a live architectural view.
2. Continuous scroll-controlled camera journey past three mirrored styling stations and leather chairs.
3. Four expandable groups of publicly listed services.
4. Camera turn toward an original bronze hair-inspired sculpture within the salon.
5. Reception view and direct phone, mobile, email, directions and Instagram links.

The room is a free architectural study, not MASSI’s real interior. It includes procedural chairs, mirrors, styling counters, reception, sofa, table, plants, wall relief, floor joints and instanced wall fluting. Generated stone/wordmark textures, local lighting, shadows, one planar reflecting mirror and environment-reflective secondary mirrors require no external assets.

GSAP ScrollTrigger drives camera progress. React Three Fiber interpolates position and look-at along separate Catmull–Rom curves with delta-time damping. Native document scrolling remains in use.

- Header, chapter dots and mobile menu navigate all chapters.
- Pause holds the camera position; resume follows scrolling again.
- System `prefers-reduced-motion` holds a static camera and removes scroll-reveal animations.
- HIGH/ECO adjust pixel ratio and mirror resolution. Small viewports default to ECO. HIGH caps pixel ratio at 1.5; ECO uses 1.
- WebGL2 absence, renderer failure and context loss show an editorial CSS fallback with usable content.
- The concept/sources dialog explains provenance. Booking is not simulated; contact does not imply a confirmed appointment.

Inspection URLs:

- `http://localhost:3000/?view=static` — forced fallback.
- `http://localhost:3000/?motion=reduced` — forced reduced motion.
- `http://localhost:3000/qa.html` — 390 × 844 iframe viewport fixture. This tests responsive CSS; it does not emulate a phone or mobile GPU.

## GPU acceptance checks to perform locally

1. Open `/` with WebGL2 and hardware acceleration. Confirm `LIVE 3D` status and visible chairs, mirrors, reception and lights.
2. Scroll forward/back. Confirm continuous camera motion, sculpture turn and return toward reception with no wall/furniture clipping.
3. Use every chapter link at slow/fast scroll speeds. Check camera/section synchronization settles correctly.
4. Inspect mirror reflections and gold/leather/stone materials. A local visual lighting pass may be needed because GPU QA was unavailable here.
5. Compare HIGH/ECO on desktop and a real phone. Measure FPS and memory with browser tools. No measured FPS claim is made.
6. Test pause/resume and your system reduced-motion preference; document navigation must remain usable.
7. Check console/Network for application errors and missing assets. Fonts should be local Next assets, not Google Fonts.
8. Test fallback, service panels, mobile menu, contact links, sources, Escape and keyboard Tab navigation.

While 3D runs, `#scene-status` exposes `data-camera`, `data-progress`, `data-fps`, `data-draw-calls`, `data-triangles` and `data-quality` as approximate diagnostics.

## Reuse and customize

- `src/lib/business.ts`: contacts, source URLs and services.
- `src/app/globals.css`: palette, type and responsive layout.
- `src/components/Experience.tsx`: chapters, controls, disclosures.
- `src/components/SalonScene.tsx`: geometry, materials, lights, textures, in-scene wordmark.
- `src/lib/camera-path.ts`: position/look-at keyframes.

Replace only with verified facts; update the in-scene wordmark as well. Reconfirm all details and obtain owner approval before any public use. Hours, prices, awards and testimonials are intentionally omitted.

`docs/RESEARCH.md`, `docs/TEST-REPORT.md` and `docs/ASSET-LICENSES.md` contain evidence and limitations. `screenshots/` contains actual fallback captures; mobile images include their testing frame. The ZIP excludes `node_modules` and `.next`, recreated by installation/build.
