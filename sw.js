const CACHE_NAME = 'radio-v1.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 绝不缓存任何音频流媒体
  if (url.pathname.match(/\.(m3u8|mp3|aac|ogg|flv)$/i) ||
      url.hostname.includes('bbcmedia') ||
      url.hostname.includes('streamguys1') ||
      url.hostname.includes('musicradio') ||
      url.hostname.includes('radioparadise')) {
    return; // 直接放行，走网络请求
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});