// BG script - provides the actual dynamic content to tabs
function getTabList(request, sender, sendResponse) {
	browser.tabs.query({}, function(tabs) {
		console.log("BG fetching tabs...");
		var resp = {"tabs" : tabs};
		sendResponse(resp);
	});
}

chrome.runtime.onMessage.addListener(getTabList);