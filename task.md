## Scope
Recreate the full public Phantom website on the managed React stack.

## Research
- Public homepage has 93 projects, a pannable distorted grid, list toggle, filters, persistent capsule navigation, sound controls, and cookie dialog.
- Original fonts, logo, sound clips, character model, project metadata and media are publicly accessible.
- Public content captured from Prismic; only homepage-listed projects will appear in the archive.
- Proprietary animations will be reconstructed, not claimed to be identical.

## Work
- [x] Initialize app and inspect original.
- [x] Capture other pages and asset inventory.
- [x] Localize public assets and content: 1,386 source files, plus original ExtraBold/Black fonts.
- [x] Implement immersive grid and reconstructed intro.
- [x] Implement all 93 homepage-listed project routes, About, Careers, Contact and legal pages.
- [x] Typecheck and lint pass.
- [x] Verify 93 archive rows, search and Google partner filtering (30 results).
- [x] Verify contact form success and saved database row; nothing sent to Phantom.
- [x] Verify 390×844 pages have no horizontal overflow: home, Agency, Careers, Casamigos and Contact.
- [x] Finish production asset optimization/build and rebuild final source changes (2 successful tasks).
- [x] Finish full project/job route audit: 93 project headings, five application forms, zero page errors.
- [x] Verify application success and database row; verify final intro/media wall readiness and 93 archive rows.

## Known differences
- The original proprietary WebGL intro, wall deformation, and team effects are reconstructed rather than exact copies.
- One source film is broken (Zedd in the Park header, original HTTP 404); an unavailable-media notice replaces it.
- Homepage/archive uses the 93 public homepage-linked projects, not unpublished CMS documents.
- Forms save in this clone, not the original agency's systems. Both contact and application success/database saves are verified.
- Original media, fonts, branding and copy remain the property of their respective owners.

## Boundaries
Contact and job forms must not silently submit to the real agency. Provide explicit local demo saving; no false delivery claims.

## Music, hover and opening refinement
- [x] Localize the original grid, other-page and project background music plus 50 desktop/mobile opening frames.
- [x] Implement looping route-specific music, opt-in consent, mute/resume, visibility handling and crossfades; verify advancing playback and original volume levels in Chrome.
- [x] Add throttled hover/pan/click/intro sounds and colored per-tile WebGL hover backgrounds; verify canvas hover hit, pointer cursor and sound playback.
- [x] Rebuild the black title/green-progress loader, opposing title exits, pixelation, character morphs and particle exit before the homepage.
- [x] Verify clickable/tappable intro sound consent, full-document re-entry, no repeated intro during internal navigation, mobile layout and reduced motion.
- [x] Inspect frozen desktop/mobile loader and morph screenshots; fix mobile source-image aspect ratio.
- [x] Final lint, typecheck and production build pass; runtime test reports zero page errors.
- Evidence: `/home/user/phantom-research/details-test.log`, `details-build-final.log`, `verified-{desktop,mobile}-{loader,morph}.png`.