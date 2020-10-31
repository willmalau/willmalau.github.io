importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
	console.log(`Yay, Workbox is loaded`);
}
else{
	console.log(`Workbox id didn't load`);
}

const urlsToCache = [
  { url: '/index.html', revision: 1 },
  { url: '/nav.html', revision: 1 },
  { url: '/jadwal-liga.html', revision: 1 },
  { url: '/klasemen-liga.html', revision: 1 },
  { url: '/css/style.css', revision: 1 },
  { url: '/js/nav.js', revision: 1 },
  { url: '/js/db.js', revision: 1 },
  { url: '/manifest.json', revision: 1 },
  { url: '/js/klasemen.js', revision: 1 },
  { url: '/js/jadwalLiga', revision: 1 },
  { url: '/js/tim.js', revision: 1 },
  "/pages/home.html",
  "/pages/favorit.html",
  "/pages/klasemen.html",
  "/pages/jadwal.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/idb.js",
  "/assets/images/jumbotron-icon.jpg",
  "/assets/images/logo-brand.png",
  "/assets/images/favicon.png",
  "/assets/images/logo-192.png",
  "/assets/images/logo-512.png",
  "/assets/images/logo-270.png",
  "/assets/images/logo-128.png",
  "/assets/images/la-liga.svg",
  "/assets/images/premier-league.png",
  "/assets/images/bundesliga.png"
];

workbox.precaching.precacheAndRoute(urlsToCache, {
ignoreUrlParametersMatching: [/.*/]
})

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
)

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
)

self.addEventListener("install", function(event) {
  event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", function(event) {
  const BASE_URL = "https://api.football-data.org/v2/";

	if (event.request.url.indexOf(BASE_URL) > -1) {
		event.respondWith(
		caches.open(CACHE_NAME).then(function(cache) {
			return fetch(event.request).then(function(response) {
			cache.put(event.request.url, response.clone());
			return response;
			})
		})
		);
	} else {
		event.respondWith(
			caches.match(event.request, { ignoreSearch: true }).then(function(response) {
				return response || fetch (event.request);
			})
		)
	}
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
      caches.keys().then(function(cacheNames) {
          return Promise.all(
          cacheNames.map(function(cacheName) {
              if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
              }
          })
          );
      })
  );
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
  body = event.data.text();
  } else {
  body = 'Push message no payload';
  }
  var options = {
  body: body,
  icon: './assets/images/favicon.png',
  vibrate: [100, 50, 100],
  data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
  }
  };
  event.waitUntil(
  self.registration.showNotification('Push Notification', options)
  );
});