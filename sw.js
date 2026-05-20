// Listen for background push events (Requires a Backend Server to trigger at 4:00 AM)
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Wake Up! 🌸";
    const options = {
        body: data.body || "A new motivational quote is waiting for you!",
        icon: 'https://api.dicebear.com/7.x/notionists/svg?seed=Star',
        badge: 'https://api.dicebear.com/7.x/notionists/svg?seed=Star',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: data.payload || {
            quote: "Default Quote",
            hindi: "डिफ़ॉल्ट उद्धरण"
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle clicking the notification on the Lock Screen / Status Bar
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const quoteData = event.notification.data;
    
    // Open the app to the specific reader page
    const targetUrl = `/?read=true&quote=${encodeURIComponent(quoteData.quote)}&hindi=${encodeURIComponent(quoteData.hindi)}`;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // If app is already open, focus it and navigate
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            // If app is closed, open a new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
