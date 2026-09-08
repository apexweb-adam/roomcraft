# Roomcraft

Original browser-based 3D spatial interaction study by Ádám Tokár, created September 8, 2026. Prepared as a work sample before the Victoria VR AI Builder Hackathon build period. This is **not** the final hackathon submission and does not claim AI scene generation.

The working Three.js scene supports camera orbit/zoom, object selection, bounded movement and rotation, two layouts, three lighting states, wall finishes, a working lamp, local persistence, and JSON export/import. Every object and texture is original procedural geometry/code. No raster scene is presented as an interactive 3D model.

## Run

Node 22.12 or later:

```sh
npm ci
npm test
npm run dev
npm run build
```

Open http://127.0.0.1:4322. No API key, backend, authentication, analytics, customer data or paid service is needed. Scene data is stored in this browser's local storage; Reset scene restores defaults. Export downloads one JSON file. Import accepts only Roomcraft version 1 JSON, up to 64 KB, and normalizes numeric positions and rotations.

The study is a visual interaction reference, not a CAD tool, layout compliance validator or engineering simulation. Bounded translations prevent unbounded movement; they do not implement collision detection. Default mobile layout stacks the scene and controls. Object selection is available as a standard keyboard-accessible select control as well as through the canvas. A visible message explains WebGL initialization failure.

## Authorship and licences

AI-assisted implementation by Codex, directed and verified for Ádám Tokár. Original source: MIT, see LICENSE. React/React DOM are MIT; Three.js is MIT; Vite is MIT. Exact versions and transitive dependencies are locked in package-lock.json. A generated UI concept is kept in design/concept.png solely as design process evidence; it is not shipped as the 3D scene. Manrope uses the SIL Open Font License when served by Google Fonts; system sans fallback remains available.

Validation and the actual public URL are recorded in design/verification.md after live verification.
