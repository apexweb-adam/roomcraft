# Verification — 8 September 2026

Live demo: https://roomcraft-adam.netlify.app

Dedicated Netlify site: e3110fd7-72ce-4054-b253-dd545bf3053a. Verified deploy: 6a9ff432300339948dda597d. Static Vite build; no ApexWeb deployment was changed.

- Four state tests pass: normalization, movement bounds, reset and scene persistence/export semantics. Production build passes; Vite reports the non-blocking large-bundle warning (approximately 203 KB gzip).
- Actual browser rendered the WebGL room. Studio/Lounge, Daylight/Night, wall finish, movement and lamp controls responded. Local reload retained chosen layout, atmosphere and wall finish. Reset restored defaults.
- Live JSON import loaded Lounge/Night/Clay and an armchair rotation of 45 degrees. Export triggered the JSON download and displayed its success state. Downloaded file contents were not independently inspected; serializer correctness is covered by state tests.
- Mobile viewport 390 × 844 rendered the room above stacked controls, with document width equal to viewport width (no horizontal overflow). Desktop and mobile screenshots are included. Temporary viewport override was reset.
- Source reviewed for original assets, no credentials, no external data submission, bounded transforms and resource disposal. Camera orbit/raycast implementation was reviewed; exhaustive device/GPU testing was not performed.

## Design comparison

Viewed both concept.png and the actual desktop screenshot. The delivered layout preserves the cream/forest palette, heading, isometric room composition, continuous right-hand inspector and controls. The actual scene uses simpler procedural geometry and materials than the generated photorealistic concept. It is genuinely rendered interactive geometry; the concept image is not used by the app. The smaller 1280 × 720 desktop viewport requires scrolling to the bottom controls; mobile intentionally stacks them below the room. This is a spatial work sample, not an AI scene generator or final competition submission.
