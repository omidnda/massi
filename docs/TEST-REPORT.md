# Implementation and verification report

Date: 23 October 2026. Local-only source delivery. Nothing deployed or published.

## Completed

Next.js 16.4.2, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei and GSAP ScrollTrigger. Five editorial chapters; a spatial salon built from procedural geometry; continuous camera/target curves; services, direct contact links, responsive navigation, motion controls, local fonts, HIGH/ECO rendering settings, and an explicit no-WebGL fallback. Research, asset provenance and installation instructions are included.

## Performed checks

| Check | Actual result |
| --- | --- |
| npm install | Passed; 114 packages installed. Lockfile included. |
| npm run typecheck | Passed. |
| npm run build | Passed after final source changes. Next generated static routes / and /_not-found. |
| npm run check:scene | Passed 2,002 samples across desktop/mobile paths: finite transforms, room bounds, nondegenerate look direction, clearance from chairs, sofa, sculpture and reception. |
| Development server | Started via managed preview supervisor using npm run dev with preview-port arguments. The wrapper accepts these while retaining Next's standard localhost:3000 default for local use. |
| Desktop browser | Actual running fallback checked at a 1363 × 936 viewport. No horizontal overflow observed. |
| Mobile layout | Actual page embedded in a 390 × 844 CSS viewport. Mobile menu and responsive content verified; document width 375 (scrollbar excluded), viewport width 390, no horizontal overflow. Not a physical phone test. |
| Chapter navigation | Header services link, service-to-contact CTA, mobile menu intro/services links and navigation state exercised. Scroll progress updated (0.9199 measured near contact). |
| Service controls | Expanded Make-up & Moments on desktop and Beauty Details on mobile; aria-expanded and treatment content verified. |
| Contact actions | Actual hrefs for phone and email inspected. No call/email sent and no appointment submitted. |
| Concept dialog | Opened, verified source/disclaimer content, closed. |
| Reduced motion | Forced reduced-motion mode verified: pressed/disabled motion control and static-mode label; content/navigation remained usable. Actual OS preference change and 3D freezing require local acceptance testing. |
| Fallback | WebGL2 detection selected the fallback in the actual browser. Text, services and contacts remained functional. |
| Console | Captured warning/error logs contained browser-extension metadata errors from chrome-extension://, with no application-origin errors observed in tested fallback flows. |
| Asset loading | Local fonts, styles and page content visibly loaded. Procedural GPU assets were not exercised because WebGL2 was unavailable. |

The environment's preview endpoint is http://terminal.local:4173/. Browser access succeeded there. A shell curl to localhost:4173 did not connect because that shell address was not the browser-visible managed preview endpoint. No claim is made that localhost:3000 was directly opened in this environment; it is the delivered dev script's default.

## Explicitly not verified

The available browser could not obtain WebGL2 and did not execute the primary 3D experience. Therefore actual 3D rendering, materials, shadows, planar reflections, scene asset initialization, camera movement as rendered, scroll-to-camera visual synchronization, GPU frame rate/memory, shader compatibility and real-device performance remain unverified. The numerical path audit and production compilation do not establish those results.

A WebGL-capable local browser may reveal issues requiring further refinement. The fallback screenshots must not be represented as proof of the requested 3D scene or as images of MASSI's actual premises. The README contains the local GPU acceptance sequence.

No FPS or Lighthouse score is claimed. Geometry uses instancing for wall flutes, one planar mirror, a 128px generated environment, no large model downloads, capped pixel ratio, and a lower-cost mobile mode; their real performance benefit needs device measurement.

## Screenshots

- 01-desktop-intro.jpg: actual fallback introduction after final refinements.
- 02-desktop-services.jpg: actual fallback with Make-up & Moments expanded.
- 03-mobile-viewport.jpg: 390 × 844 page in the QA fixture.
- 04-mobile-services.jpg: expanded Beauty Details in reduced-motion mode.
- 05-mobile-contact.jpg: responsive contact chapter.

All are captures of the running website, not generated mockups. The mobile captures retain the surrounding fixture. Sections taller than the viewport require normal scrolling.
