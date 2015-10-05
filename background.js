var ExtensionOn = true;
var ExtensionOff = false;
//window.alert("is it working??");
//window.setTimeout(showpopup(),3000);
chrome.alarms.create('alarm', {delayInMinutes:0.1 , periodInMinutes: 0.2 } );
chrome.alarms.onAlarm.addListener(showpopup("hello"));


function showpopup(message)
{
	//Replace hello world with param message;
	window.alert(message);
	//showpopup gets executed if ExtensionOn is true. 
	//every t minutes, show message.
	//chrome.alarms.create(string alarm, double delayinMinutes);
	//chrome.alarms.clear(string alarm);
	//chrome.alarms.onAlarm.addListener(function callback);
}

/*

function click(e){
	if(ExtensionOn)
	{
		ExtensionOff = true;
		ExtensionOn = false;
		chrome.alarms.clear(string alarm);
		window.alert("Test");
	}

	if(ExtensionOff)
	{
		ExtensionOn = true;
		ExtensionOff = false;
		// Replace 15.0 with user selected time in minutes	

	}
}

if(ExtensionOn)
{
	chrome.alarms.create(string alarm, double 15.0);
	chrome.alarms.onAlarm.addListener(function showpopup);
}

chrome.browserAction.onClicked.addListener(click);
*/

//chrome.browserAction.setBadgeText({text: "On/Off"});
