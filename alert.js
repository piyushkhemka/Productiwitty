var ExtensionOn = true;

function SwitchOn()
 {
     chrome.alarms.create("Alarm", {delayInMinutes: 0.1, periodInMinutes: 1} );
     console.log("Switch On function called");

 }

function SwitchOff() 
 {
    chrome.alarms.clear("Alarm");
    console.log("Switch Off function called");

 }

 function showpopup()
{
	if(ExtensionOn)
	{
		alert("Inside function showpopup");
		console.log("alert shown");
		console.log("Is extension on?" + ExtensionOn);
	}
}

function click(e)
{
	if(ExtensionOn)
	{
		SwitchOff();
		console.log("switched off");
		chrome.browserAction.setBadgeText({text: "Off"});
		
	}

	else if(!ExtensionOn)
	{
		SwitchOn();
		console.log("switched on");
		chrome.browserAction.setBadgeText({text: "ON"});


		// Replace 15.0 with user selected time in minutes	

	}
	//Toggle ExtensionOn
	ExtensionOn = !ExtensionOn;

	

}
/*

function click(e){

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.cmd == "setOnOffState")
		{
			ExtensionOn = request.data.value;
		}

		if(request.cmd == "getOnOffState")
		{
			sendResponse(ExtensionOn);
		}
	});

}*/


chrome.alarms.onAlarm.addListener(showpopup);

chrome.browserAction.onClicked.addListener(click);


