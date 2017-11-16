var ExtensionOn = true;
chrome.alarms.clearAll();


// Initially set to 15
var timerPeriodInMinutes = 0.1;
var timeDelayInMinutes = 0.1;
var config = {
	message: "Focus. Don't get distracted",
	button: "OK",
	icon: "success"
};

console.log("local storage timer = " + localStorage.timer);


function SwitchOn() {
     chrome.alarms.create('Alarm', {
     periodInMinutes: timerPeriodInMinutes,
     delayInMinutes:  timeDelayInMinutes
    });
 }

 function SwitchOff() {

    chrome.alarms.clear("Alarm");
    console.log("Switch Off function called" + Date() );

 }

 function showpopup() {
		console.log(" in show popuup");
		console.log("is extension on? = " + ExtensionOn);
		console.log(Date());
		// chrome.tabs.executeScript(null, {file: 'sweetalert.js'}, function() {
		//     console.log('Its loaded!');
		// });
		chrome.tabs.executeScript(null, {
		code: 'var config = ' + JSON.stringify(config)
		}, function() {
		    chrome.tabs.executeScript(null, {file: 'sweetalert.js'}, function() {
		    	console.log("Alarm triggered");
		    });
		});

}

function click(e) {
	if(ExtensionOn) {
		SwitchOff();
		console.log("switched off" + Date());
		chrome.browserAction.setIcon({path : "images/red128.png"});
		chrome.browserAction.setBadgeText({text: "Off"});
	}

	else {
		SwitchOn();
		console.log("switched on");
		chrome.browserAction.setIcon({path : "images/green128.png"});
		chrome.browserAction.setBadgeText({text: "On"});
		chrome.browserAction.setPopup();
	}

	ExtensionOn = !ExtensionOn;
}

chrome.runtime.onInstalled.addListener(SwitchOn);

chrome.alarms.onAlarm.addListener(showpopup);

chrome.browserAction.onClicked.addListener(click);