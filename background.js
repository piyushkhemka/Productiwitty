var ExtensionOn = true;
chrome.alarms.clearAll();

var defaultTimerPeriodInMinutes = 15;
var defaultTimeDelayInMinutes = 15;
var defaultMessage = "Focus. Don't get distracted";
var timerPeriodInMinutes, timeDelayInMinutes, displaymessage;

if(localStorage.timer == undefined) {
	timerPeriodInMinutes = defaultTimerPeriodInMinutes;
	timeDelayInMinutes = defaultTimeDelayInMinutes;
} else {
	timerPeriodInMinutes = localStorage.timer;
	timeDelayInMinutes = localStorage.timer;
}

if(localStorage.displaymessage == undefined) {
	displaymessage = defaultMessage;
} else {
	displaymessage = localStorage.displaymessage;
}

console.log("ExtensionOn = " + ExtensionOn);
console.log("local storage timer = " + timerPeriodInMinutes);
console.log("final displaymessage = " + displaymessage);


function SwitchOn() {
     chrome.alarms.create('Alarm', {
     periodInMinutes: parseFloat(timerPeriodInMinutes),
     delayInMinutes:  parseFloat(timeDelayInMinutes)
    });
     console.log("Switch On function called" + Date() );
 }

 function SwitchOff() {

    chrome.alarms.clear("Alarm");
    console.log("Switch Off function called" + Date() );
 }

 function showpopup() {

 		console.log("ExtensionOn = " + ExtensionOn);
 		console.log(!ExtensionOn);
 		if(!ExtensionOn) {
 			SwitchOff();
 			return;
 		}

 		var config = {
			message: displaymessage,
			button: "OK",
			icon: "success"
		};

		console.log(" in show popuup");
		console.log("is extension on? = " + ExtensionOn);
		console.log(Date());

		chrome.tabs.executeScript(null, {
		code: 'var config = ' + JSON.stringify(config)
		}, function() {
		    chrome.tabs.executeScript(null, {file: 'raisealert.js'}, function() {
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
	} else {
		SwitchOn();
		console.log("switched on");
		chrome.browserAction.setIcon({path : "images/green128.png"});
		chrome.browserAction.setBadgeText({text: "On"});
	}
	ExtensionOn = !ExtensionOn;
}

chrome.runtime.onInstalled.addListener(SwitchOn);

chrome.alarms.onAlarm.addListener(showpopup);

chrome.browserAction.onClicked.addListener(click);