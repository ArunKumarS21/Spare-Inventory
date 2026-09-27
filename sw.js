// Minimal service worker — required for "Add to Home Screen" / install prompt.
// Not doing offline caching here since this app needs a live connection to sync data.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => {}); // no-op, network passthrough
