// It cannot simply reply on history popstate to detect the url changing
// In order to monitor the url changing, use the chrome api here
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      type: 'roo/locationChanged',
      url: changeInfo.url
    });
  }
});
