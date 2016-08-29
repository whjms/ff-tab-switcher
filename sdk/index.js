var self = require("sdk/self");
var data = self.data;

var panel = require("sdk/panel").Panel({
	contentURL: data.url("panel.html"),
	contentScriptFile: data.url("panel.js"),
	contentStyleFile: data.url("panel.css"),
	width: 500,
	height: 400
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

function togglePanel() {
	if(panel.isShowing) {
		panel.hide();
	} else {
		panel.port.emit("ready", JSON.stringify(getTabList()));
		panel.show();
	}
}

// setup hotkey
var { Hotkey } = require("sdk/hotkeys");
var showPanelKey = Hotkey({
	combo: "alt-c",
	onPress: togglePanel
});

// switch to selected tab
panel.port.on("selectTab", tab => {
	console.log(`selectTab(${tab})`);
});

// alert the content script when it's been hidden
panel.on("hide", function() {
	panel.port.emit("hide");
});