const cacheName = "my-cache";
//The files I'm going to cache
const filesToCache = [
    "/",
    "index.html",
    "./src/App.js"
];

// Installing the Service Worker (service-worker.js)
// This process is only called once the Service Worker has been loaded in the browser. If you modify the existing Service Worker, the browser will install the Service Worker again with the newest changes.

// This cycle has an install event that gets triggered while the Service Worker is being installed. 
//During the installation of the Service Worker, you can handle some async operations if needed E.g. caching static assets. The event.waitUntil() method will keep the Service Worker in the install phase until the promise passed to event.waitUntil() is settled. Depending on whether that promise is resolved or rejected, the installation phase will either finish successfully or won’t.
self.addEventListener("install", e => {
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(filesToCache);
    })());
});


//Activate Service Worker (service-worker.js)
//This lifecycle is super important because it allows us to do some clean-up in our cache. Be aware that your browser has a memory size limit for the cache, so you want to make sure to keep the cache clean to free up space.
self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        // Get a list of all your caches in your app
        const keyList = await caches.keys();
        await Promise.all(
            keyList.map(key => {
                /* 
                   Compare the name of your current cache you are iterating through
                   and your new cache name
                */
                if (key !== cacheName) {
                    console.log("[ServiceWorker] - Removing old cache", key);
                    return caches.delete(key);
                }
            })
        );
    })());
    e.waitUntil(self.clients.claim());
});
//In the code above, compare the name of your current cache you are iterating through and your new cache name, if they are not the same the current cache will be deleted freeing up space in the browser memory and the new cache will take place.

const API_URL = "https://dummyjson.com/products?limit=500";

self.addEventListener("fetch", event => {
    if (event.request.url === API_URL) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const resClone = response.clone();
                    caches.open('my-cache').then(cache => {
                        cache.put(event.request, resClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
});