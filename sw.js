// Minimal service worker: phones (e.g. Chrome on Android) can only show
// notifications through a service worker. Tapping a notification opens the app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("./"));
});
