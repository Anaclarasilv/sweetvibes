self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open('todo-cache').then(function(cache){
			return cache.addAll([
			'/',
			'/index.html',
			'/style.css',
			'/script.js',
			'/manifest.json',
            '/app.js',
            '/models.js',
            '/service.worker.js',
            '/util.js',
			]);
		})
	);
});
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request).then(function(response){
			return response || fetch(event.request);
		})
	);
});