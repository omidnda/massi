# MASSI 2D — implementation and verification

25 October 2026. Local-only redesign. No deployment or domain/hosting changes.

## Implementation

Replaced the WebGL scene with a photographic editorial layout: cream/brown/gold palette, large locally served serif headings, responsive hero crops, asymmetric salon introduction, four service cards with native details, a cinematic beauty diptych, contact section and mobile call action. Existing business data in src/lib/business.ts was preserved. Demo and sample-image disclosures remain visible.

Removed SalonScene.tsx, camera-path.ts, check-scene.mjs and the superseded visual-refresh.css stylesheet. Removed three, @react-three/fiber, @react-three/drei, @types/three and gsap; 63 packages removed during uninstall. CSS transitions and IntersectionObserver replace the animation dependency.

## Executed checks

- `npm run build`: passed on final source; static routes /, /_not-found and /icon.svg.
- `npm run typecheck`: passed; production build also completed TypeScript validation.
- `git diff --check`: passed.
- Chromium browser QA at 320, 360, 390, 430, 768, 1024 and 1440 pixels: no horizontal overflow; zero canvas elements at every width.
- Traversed salon, services, beauty and contact sections at every width.
- Opened service details and the concept dialog at every width; closed dialog using Escape.
- Opened the mobile menu and navigated to services at every mobile width; menu closed successfully.
- Emulated prefers-reduced-motion: content visible without entrance animation classes.
- No application page errors or console errors in the final complete responsive run. An initial missing favicon request was corrected.
- No failed image loads among completed image requests. Local Next Image responsive variants and fonts loaded.
- Inspected actual desktop hero/full-page and mobile hero screenshots. New screenshots replace obsolete 3D-fallback captures.
- Contact hrefs retain the existing phone, mobile, email, maps and Instagram destinations; no phone call/email/booking was submitted.

## Limits

Browser tests use desktop Chromium resized to mobile widths, not physical Android/iOS devices. Safari, real touch hardware and mobile-network behavior are not verified. Lighthouse is a synthetic local measurement, not a real-user guarantee. SEO remains intentionally restricted by noindex/nofollow because this is an unofficial demo.

Images are stock examples under the Unsplash license (see ASSET-LICENSES.md), not salon evidence. Portrait and product images should be replaced with owner-approved commissioned photography before public commercial use. Business information keeps the original 23 October verification date; no new live verification is claimed.

## Captures

- screenshots/01-desktop-intro.jpg
- screenshots/02-desktop-services.jpg
- screenshots/03-mobile-viewport.jpg
- screenshots/04-mobile-services.jpg
- screenshots/05-mobile-contact.jpg
- screenshots/06-desktop-full.jpg

All captures show the actual 2D implementation. Mobile images are direct viewport screenshots without an iframe surround.

## Lighthouse mobile production audit

Performance 96, Accessibility 100, Best Practices 100, SEO 63. FCP 0.9 s, LCP 2.8 s, CLS 0.007, total blocking time 20 ms. SEO is reduced by intentional noindex/nofollow. One additional unweighted label-name advisory was resolved afterward by allowing the wordmark link to use its visible text as its accessible name. The final hero also uses explicit eager loading and high fetch priority per the installed Next.js documentation; the production build was rerun after these minor corrections. Lighthouse numbers above refer to the preceding audited build. The audit JSON is retained in docs/lighthouse-mobile.json.
