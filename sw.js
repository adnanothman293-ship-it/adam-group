/* ADAM GROUP — إشعارات الموبايل */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'ADAM GROUP', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'ADAM GROUP', {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    dir: 'rtl',
    lang: 'ar',
    data: { url: d.url || '' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.url) || '';
  const target = new URL('./' + hash, self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) {
        c.postMessage({ type: 'open', url: hash });
        return c.focus();
      }
    }
    return self.clients.openWindow(target);
  }));
});
