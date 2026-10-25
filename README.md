# MASSI — The art of becoming

Independent, unsolicited **2D editorial website concept** for Salon Massi, Hamburg. Not the official website. Local delivery only; no deployment, backend, database, analytics or online booking.

## Run locally

Node.js 22.18+ required.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run typecheck
npm run build
npm start
```

## Experience

Responsive photographic hero, editorial salon introduction, four service cards with native expandable details, beauty feature and direct contact links. The mobile menu supports Escape and keyboard focus containment; the native concept dialog contains sources and image disclosure. A persistent mobile telephone CTA opens the dialer, without implying a confirmed appointment.

Natural scrolling, lightweight IntersectionObserver/CSS entrance transitions, and system `prefers-reduced-motion` support. No WebGL, canvas, camera, GPU scene, scroll hijacking or animation library. Content is server rendered and remains available without JavaScript; interactive navigation/dialog require JavaScript.

Images are local sample photography, optimized by Next Image with responsive sizes and a prioritized hero. Different mobile/desktop crops use the same source to avoid duplicate downloads. Photos do not represent MASSI's premises, team, clients or results. See docs/ASSET-LICENSES.md.

## Edit

- `src/lib/business.ts`: existing verified contacts, services and source links; preserved in this redesign.
- `src/components/Experience.tsx`: sections, navigation, dialog and entrance observation.
- `src/app/globals.css`: warm cream/brown/gold palette, typography and responsive layouts.
- `public/images/`: local licensed sample photography.
- `docs/TEST-REPORT.md`: actual checks and limitations.

No hours, prices, testimonials or new services have been invented. Business facts retain their original 23 October 2026 verification date. Reconfirm them with the owner before any future publication. Hosting/domain configuration was not changed.
