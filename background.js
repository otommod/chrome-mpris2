let connections = 0;
let host = null;
let pages = [];

chrome.runtime.onConnect.addListener(function (page) {
    if (!connections++)
        host = chrome.runtime.connectNative('org.mpris.browser_host');

    pages.push(page);
    function passMessage (msg) {
        if (msg.tabId === page.sender.tab.id || msg.tabId < 0) {
            switch (msg.method) {
                case 'Raise':
                    raiseTab(msg.tabId);
                    break;
                case 'Quit':
                    removeTab(msg.tabId);
                    break;
                default:
                    page.postMessage(msg);
            }
        }
    }

    host.onMessage.addListener(passMessage);

    page.onMessage.addListener(function (msg) {
        msg.tabId = page.sender.tab.id;
        host.postMessage(msg);
    });
    page.onDisconnect.addListener(function () {
        host.postMessage({ type: 'quit', tabId: page.sender.tab.id });
        host.onMessage.removeListener(passMessage);
        if (!--connections)
            host.disconnect();
    });
});

function raiseTab (tabId) {
    // first activate the tab, this means it's current in its window
    chrome.tabs.update(tabId, { active: true }, function (tab) {
        if (chrome.runtime.lastError || !tab) {
            // this "lastError" stuff feels so archaic
            // failed to update
            return;
        }
        // then raise the tab's window too
        chrome.windows.update(tab.windowId, { focused: true });
    });
}

function removeTab (tabId) {
    chrome.tabs.remove(tabId);
}
