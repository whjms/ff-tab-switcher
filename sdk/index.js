var self = require("sdk/self");
var data = self.data;

var panel = require("sdk/panel").Panel({
	contentURL: data.url("panel.html"),
	contentScriptFile: data.url("panel.js"),
	contentStyleFile: data.url("panel.css")
});

// returns a list of objects
//		title: tab title
//		icon: favicon URI XXXX--- not yet
function getTabList() {
	var tabs = Array.prototype.slice.call(require("sdk/tabs"));
	let { getFavicon } = require("sdk/places/favicon");
	var list = tabs.map(tab => ({ title: tab.title }));

	return list;
}

function showPanel() {
	panel.port.emit("ready", JSON.stringify(getTabList()));
	panel.show();
}

// setup hotkey
var { Hotkey } = require("sdk/hotkeys");
var showPanel = Hotkey({
	combo: "alt-c",
	onPress: showPanel
});

// switch to selected tab
panel.port.on("selectTab", tab => {
	console.log(`selectTab(${tab})`);
});

// alert the content script when it's been hidden
panel.on("hide", function() {
	panel.port.emit("hide");
});