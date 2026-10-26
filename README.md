# Srinjoy Chakraborty — Research Portfolio

A lightweight, static academic portfolio for a PhD researcher in Control & Automation at IIT Kanpur.

## Pages
- **index.html** — research identity, current interests, selected work, academic journey and contact.
- **projects.html** — project descriptions, verified repository destinations and the eight-slide profilometry gallery.
- **css/styles.css** — shared responsive design system.
- **js/scripts.js** — accessible mobile navigation and copyright year only.

## Design
Charcoal background, subtle glass panels, muted cyan accent, two complementary font families and minimal motion. No runtime animation framework, particle canvas, tracking script or PHP dependency.

## Hosting
The site is designed for GitHub Pages. Serve the repository root from the **master** branch, using the existing project URL:
https://srinjoy2002.github.io/Srinjoy-02/

No build command is required. Updates to the configured publishing branch deploy automatically when GitHub Pages is enabled.

## Editing
1. Update academic and project copy in the HTML files.
2. Add project images under assets/ and reference their exact filenames.
3. Keep images appropriately sized and use WebP/AVIF for new media where possible.
4. Test at 320, 375, 390, 768, 1024 and 1440 px, with keyboard navigation and reduced motion.
5. Run Lighthouse and an accessibility audit after deployment.

## Notes
- The former generic M.Tech education entry and fabricated GitHub counters were removed.
- LinkedIn and Scholar links were omitted because no confirmed personal profile URLs were available.
- The original DeepProfilometer repository link returned 404, so the flagship project links to its local project-detail section instead.
- Numerical results displayed on project pages are carried over from the prior portfolio and are identified as project-reported, not independently verified.
- Existing large video assets remain in the repository but are not loaded on the homepage.
