var container = document.querySelector("#tabs");
var keys = "asdf";
var inputWaitTime = 200;

function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
        document.createTextNode( html ) ).parentNode.innerHTML;
};

function generateKeyBindings(tabs) {
	// set initial shortcut to blank
	tabs.forEach(tab => tab.keys = "");

	// get the key at index idx, modulo.
	// this is to make looping over the entire array simpler (no need for
	// bounds checks)
	let getKey = idx => keys[idx % keys.length];

	// the maximum length (in characters) of hotkey:
	//		e.g. if there are 15 tabs and 7 chars, the first 7 tabs can be
	//		assigned single letters, the next 7 get 2 letters, and the last
	//		one gets three
	//			-> ceil(15/7) = 3
	let maxLength = Math.ceil(tabs.length / keys.length);

	// do multiple passes, adding characters to the keycodes for tabs as
	// we go along - e.g. for a set of keys abc and 8 tabs:
	//	pass 1: 1-a 2-b 3-c 4-a 5-b 6-c 7-a 8-b		(1 character tabs done)
	//	pass 2: 1-a 2-b 3-c 4-ab 5-bc 6-ca 7-ab 8-bb (2 character tabs done)
	//												(note that for the 2nd pass we offset our
	//												starting char (starts @ b). this is to make
	//												sure that the hotkeys are distinctive)
	//	pass 3: 1-a 2-b 3-c 4-ab 5-bc 6-ca 7-abc 8-bba (3 char tabs done)
	//		note again that the offset for adding chars here increases to 2 (starts at c)
	//		this would increase for larger tab sets
	for(let currLength = 0; currLength <= maxLength; currLength++) {
		while(currLength <= maxLength) {
			for(let i = keys.length * currLength; i < tabs.length; i++) {
				tabs[i].keys += getKey(i + currLength);
			}
			currLength++;
		}
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

	// force the focus to enter our frame/panel so that the JS can capture it
	container.focus();
});

function getInput() {
	return container.getAttribute("data-input-keys");
}
function setInput(val) {
	container.setAttribute("data-input-keys", val);
	return val;
}

function switchToTab(index) {
	self.port.emit("selectTab", index);
}

// delete all the tabs from the panel when it's dismissed
// NOTE: this is a message sent from the addon script
self.port.on("hide", function() {
	while(container.firstChild) {
		container.removeChild(container.firstChild);
	}

	setInput("");
});

// event handlers for key press
function keyPress(code) {
	var codeOf = char => char.charCodeAt(0);

	if(codeOf("A") <= code && code <= codeOf("z")) {
		let char = String.fromCharCode(code);
		let input = setInput(getInput() + char);
		console.log(`input: ${input}`);
		let tabs = Array.from(container.children);
		
		// see if we've found the tab we were searching for, and update classes
		for(let i = 0; i < tabs.length; i++) {
			let tab = tabs[i];
			// if we've typed in our selector, wait a little while to see if we're
			// done typing
			if(tab.querySelector(".keys").innerHTML === input) {
				let currentInput = input;
				setTimeout(() => {
					if(getInput() === currentInput) {
						switchToTab(i);
					}
				}, inputWaitTime);
			}
		}
	}
}

window.onkeypress = function(e) {
	keyPress(e.which);
}