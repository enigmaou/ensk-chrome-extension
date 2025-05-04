export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background:', message);
    if (message.type === 'GET_EXTENSIONS') {
      if (chrome.management) {
        chrome.management.getAll((items) => {
          const extensions = items.map((ext) => ({
            name: ext.name,
            permissions: ext.permissions || [],
            hostPermissions: ext.hostPermissions || [],
            icons: ext.icons || [], // Use icons array
          }));
          sendResponse({ success: true, extensions });
        });
        return true; // Indicates that the response will be sent asynchronously
      } else {
        sendResponse({ success: false, error: 'chrome.management API is not available' });
      }
    }
  });
});
