let settings = null;
let timeoutId = null;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_SETTINGS') {
    settings = event.data.settings;
    console.log('Service Worker received settings:', settings);
    scheduleNotification();
  }
});

function scheduleNotification() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (!settings || !settings.enabled || settings.days.length === 0) {
    console.log('Notifications are disabled or no days selected.');
    return;
  }

  const now = new Date();
  const [hours, minutes] = settings.time.split(':').map(Number);
  
  let nextNotificationTime = null;

  // Check next 7 days + today to find the next valid day
  for (let i = 0; i < 8; i++) {
    const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dayOfWeek = checkDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    if (settings.days.includes(dayOfWeek)) {
      const potentialNextTime = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate(), hours, minutes, 0, 0);
      if (potentialNextTime > now) {
        nextNotificationTime = potentialNextTime;
        break;
      }
    }
  }

  if (nextNotificationTime) {
    const delay = nextNotificationTime.getTime() - now.getTime();
    console.log(`Next notification scheduled for: ${nextNotificationTime} (in ${Math.round(delay / 1000 / 60)} minutes)`);
    
    timeoutId = setTimeout(() => {
      const iconUrl = new URL('/vite.svg', self.location.origin).href;
      self.registration.showNotification('Gebetserinnerung', {
        body: 'Zeit für eine Gebetspause. Öffne die App und verbinde dich mit Gott.',
        icon: iconUrl,
        badge: iconUrl
      });
      // Schedule the next one after this one has fired
      scheduleNotification();
    }, delay);
  } else {
    console.log('No upcoming notification scheduled.');
  }
}