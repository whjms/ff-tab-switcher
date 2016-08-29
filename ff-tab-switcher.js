// alert(chrome.extension.getURL("selector.html"));

// create our content frame
var frame = document.createElement('iframe');
frame.src = chrome.extension.getURL("selector.html");

// style - why can't I overlay an element and ignore the page's CSS
Object.assign(frame.style, {
	position: "fixed",
	top: "50%",
	left: "50%",
	"z-index": "9999999",
	transform: "translateX(-50%) translateY(-50%)",
	border: "1px solid #a6a6a6",
	background: "#232323",
	"border-radius": "10px",
	"box-shadow" : "0 0 25px #000"
});

document.body.appendChild(frame);


function proc(resp) {
	console.log("got message:");
	console.log(resp);
}
console.log("sending message...");
chrome.runtime.sendMessage({"msg" : "test"}, proc);