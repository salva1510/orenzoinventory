# Orenzo Inventory Pro — PWA patch

This package adds Progressive Web App support to the existing static inventory app.

## Files
- `index.html` — adds PWA metadata, manifest link, install button, and registration script
- `manifest.webmanifest` — app name, standalone display, and icon declarations
- `service-worker.js` — caches the app shell and supports offline reopening after the first successful load
- `pwa-register.js` — registers the service worker and handles installation prompts
- `icons/` — install icons for Android/desktop and maskable icon

## Install after deployment
- Android / Chrome: open the HTTPS website, tap **Install App** (or browser menu > Install app).
- Windows / Edge or Chrome: use the **Install App** button or browser install icon.
- iPhone / iPad: open the site in Safari > Share > Add to Home Screen.

## Important data note
This PWA layer does not add cloud sync. Existing inventory records remain in the browser's local storage, as before. Offline mode is intended for reopening the app shell after the first successful online visit; browser storage and cached files can still be cleared by the device/browser.

## Responsive layout
The dashboard keeps the same structure and content order on desktop, tablet and phone. Cards and controls resize to fit the screen; the product table keeps its full columns and can be swiped horizontally on narrow screens.
