var container = document.querySelector("#tabs");

function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
};

function generateKeyBindings(tabs) {
	var keys = "asdfgh";

	for(i = 0; i < tabs.length; i++) {
		tabs[i].keys = keys[i];
	}

	return tabs;
}

function generateLI(tab) {
	var html = 
		`<li>
			<kbd class="keys">${htmlEncode(tab.keys)}</kbd>
			<span class="title">${htmlEncode(tab.title)}</span>
		</li>`;

	var template = document.createElement('template');
	template.innerHTML = html;
	return template.content.firstChild;
}


self.port.on("ready", function(msg) {
	var tabs = generateKeyBindings(JSON.parse(msg));

	var tabLIs = tabs.map(generateLI);

	tabLIs.forEach(li => container.appendChild(li));
	self.port.emit("selectTab", 0);
});

// delete all the tabs from the panel when it's dismissed
// NOTE: this is a message sent from the addon script
self.port.on("hide", function() {
	while(container.firstChild) {
		container.removeChild(container.firstChild);
	}
});