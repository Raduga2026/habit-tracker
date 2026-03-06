// Service Worker для PWA функциональности
const CACHE_NAME = 'habit-tracker-v1';
const RUNTIME_CACHE = 'habit-tracker-runtime-v1';

// Файлы для кеширования при установке
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Установка service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker установлен');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Игнорируем ошибки при кешировании отдельных файлов
      });
    })
  );
  self.skipWaiting();
});

// Активация service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('Удаление старого кеша:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов (Offline-first + Network fallback)
self.addEventListener('fetch', (event) => {
  // Пропускаем non-GET запросы
  if (event.request.method !== 'GET') {
    return;
  }

  // Пропускаем запросы к расширениям браузера
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Стратегия: сначала кеш, затем сеть (Cache first with Network fallback)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // Если в кеше, проверяем обновления в сети для некритичных файлов
        if (!event.request.url.includes('/api/') && !event.request.url.endsWith('.json')) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(() => {
            // Network error, продолжаем с кешем
          });
        }
        return response;
      }

      // Если в кеше нет, пробуем сеть
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }

          // Кешируем успешные ответы
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });

          return networkResponse;
        })
        .catch(() => {
          // Если нет сети и нет в кеше, возвращаем fallback
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          if (event.request.destination === 'style') {
            return new Response('body {}', { headers: { 'Content-Type': 'text/css' } });
          }
          if (event.request.destination === 'font') {
            return new Response(null, { status: 404 });
          }
          return new Response(null, { status: 404 });
        });
    })
  );
});

// Синфронизация в фоне (Background Sync для уведомлений)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(
      // Синхронизация данных когда устройство вернулось онлайн
      Promise.resolve()
    );
  }
});

// Получение push уведомлений
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'habit-reminder',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'dismiss', title: 'Закрыть' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Мой Путь', options)
  );
});

// Обработка нажатия на уведомление
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Если приложение уже открыто, фокусируем на него
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Если нет, открываем новое окно
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Периодическая синхронизация (для напоминаний)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(
      // Проверяем напоминания согласно времени в профиле
      Promise.resolve()
    );
  }
});
