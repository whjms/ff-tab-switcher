function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
};

self.port.on("ready", function(msg) {
	var tabs = JSON.parse(msg);
	var container = document.querySelector("#tabs");

	var tabLIs = tabs.map(tab => {
		var li = document.createElement("li");
		li.innerHTML = htmlEncode(tab.title);
		return li;
	});

	tabLIs.forEach(li => container.appendChild(li));
});