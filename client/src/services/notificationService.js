/**
 * Requests permission to show browser notifications.
 */
export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return;
  }
  Notification.requestPermission();
}

/**
 * Shows a browser notification.
 * @param {string} title The title of the notification.
 * @param {string} body The body text of the notification.
 */
export function showBrowserNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
