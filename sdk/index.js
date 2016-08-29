var self = require("sdk/self");
var data = self.data;
let width = 600;
let maxHeight = 900;
var panel = require("sdk/panel").Panel({
	contentURL: data.url("panel.html"),
	contentScriptFile: data.url("panel.js"),
	contentStyleFile: data.url("panel.css"),
	width: width,
	height: maxHeight
});

// returns a list of objects
//		title: tab title
//		icon: favicon URI XXXX--- not yet
function getTabList() {
	var tabs = Array.prototype.slice.call(require("sdk/tabs"));
	let { getFavicon } = require("sdk/places/favicon");
	for(let i = 0; i < tabs.length; i++) {
		let tab = tabs[i];
		getFavicon(tab).then(url => {
			tab.icon = url
		});
	}
	var list = tabs.map(tab => ({ title: tab.title, icon: tab.icon }));

	return list;
}

function togglePanel() {
	if(panel.isShowing) {
		panel.hide();
	} else {
		let tabs = getTabList();
		let tabHeight = 34;

		panel.resize(width, Math.min(maxHeight, 20 + 20 + tabHeight * tabs.length));

		let prefs = require("sdk/simple-prefs").prefs;
		panel.port.emit("ready", JSON.stringify({
			tabs: tabs,
			keys: prefs.keys,
			delay: prefs.delay
		}));
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
panel.port.on("selectTab", index => {
	let tabs = require("sdk/tabs");
	tabs[index].activate();
	panel.hide();
});

// alert the content script when it's been hidden
panel.on("hide", function() {
	panel.port.emit("hide");
});