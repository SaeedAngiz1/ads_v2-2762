# Phantom recreation

Source reference: https://www.phantom.land

## Implemented scope

- 93 projects linked by the captured public homepage, with full localized CMS case-study content.
- Drag/wheel/keyboard project wall; grid/list view; search and zone, feature, region and partner filters.
- Agency and Approach pages, project galleries, team portraits, Careers and five application routes.
- Contact, Privacy Policy, AI Policy and Modern Slavery Statement.
- Original public fonts, branding, still images, videos, sound effects, model and atlas assets.
- Responsive layouts, sound opt-in, cookie-preference persistence and reduced-motion support.
- Original looping background tracks for the work grid, project pages and other pages, with route crossfades and hover, swipe, click and opening sound effects.
- Black title/green-progress opening screen, sliding/skewed titles, original character-frame pixelation and morph sequence, reconstructed particle exit and grid entrance.
- Colored WebGL tile hover backgrounds and link, archive-row and related-project hover treatments.

Audio starts after a click/tap because browsers restrict autoplay. Use the opening's “CLICK TO ENABLE SOUND” prompt or the header sound switch. The consent preference persists, but a browser may require another gesture after a full document reload. Music pauses when the document is hidden. The opening runs on full homepage loads, not each internal navigation back to Work.

## Deliberate differences and limitations

This is an independent recreation, not a site operated by Phantom. Original branding, imagery, films, fonts and copy belong to their respective owners. Public accessibility does not grant permission to reuse those materials commercially; obtain the necessary rights before publishing.

The original proprietary WebGL intro, wall distortion and interactive portrait treatments are approximated with new Three.js implementations. Transition timing, physical simulation and some scrolling/carousel arrangements differ. This is not a pixel-identical or frame-identical copy.

The public homepage-linked archive contains 93 projects. Additional CMS documents not linked by that homepage were not imported into this archive. Content is a captured snapshot, not a live CMS synchronization.

The original Zedd in the Park header film URL returned HTTP 404. The clone displays a media-unavailable notice rather than inventing a replacement.

Contact and application forms save to this application's database. They never submit to Phantom. The form and success state disclose this explicitly. External email, WhatsApp, social and live-project links retain their original public destinations and open only when clicked.

## Development

Run `bun run dev` from the app root. Use the platform preview and publishing controls for deployment. The service port is template-managed.

`bun run lint` and `bun run --cwd packages/web typecheck` are the source validation commands. `bun run build` includes asset optimization of the large original archive; the first build takes longer, and later builds reuse the optimizer cache.