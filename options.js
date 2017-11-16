var defaultTimerInMinutes = 15;

function loadOptions() {
	var timer = localStorage["timer"];

	// valid colors are red, blue, green and yellow
	if (timer == undefined) {
		timer = defaultTimerInMinutes;
	}

	var select = document.getElementById("defaultTimerInMinutes");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value == timer) {
			child.selected = "true";
			break;
		}
	}
}

function saveOptions() {
	var select = document.getElementById("timer");
	var userTimer = select.children[select.selectedIndex].value;
	localStorage["timer"] = userTimer;
}

function eraseOptions() {
	localStorage.removeItem("timer");
	location.reload();
}