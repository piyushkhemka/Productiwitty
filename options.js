var defaultTimerInMinutes = 15;
var defaultDisplayMessage = "Focus. Don't get distracted";

window.onload = function () {

	var timer = localStorage["timer"];
	var displaymessage = localStorage["displaymessage"];
	console.log(timer);
	console.log(displaymessage);

	if (timer == undefined) {
		timer = defaultTimerInMinutes;
	}

	if(displaymessage == undefined) {
		displaymessage = defaultDisplayMessage;
	}

	var select = document.getElementById("timer");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		console.log("timer value right now =  " + timer);
			if (child.value == timer) {
			child.selected = "true";
			break;
		}
	}

	document.getElementById("displaymessage").defaultValue = displaymessage;


	document.getElementById('restore').onclick = function eraseOptions() {
		localStorage.removeItem("timer");
		localStorage.removeItem("displaymessage");
		chrome.runtime.reload();
	};

	document.getElementById('save').onclick = function saveOptions() {
		console.log("in save js");
		var select = document.getElementById("timer");
		var userTimer = select.children[select.selectedIndex].value;
		
		localStorage["timer"] = userTimer;
		localStorage["displaymessage"] = document.getElementById("displaymessage").value;

		console.log(userTimer);
		console.log(localStorage["displaymessage"]);
		chrome.runtime.reload();
	};
}