
var ExtensionOn = true;
chrome.alarms.clearAll();
/*
chrome.windows.create({url: "hello.html", 
					   type:"popup",
					   focused: true, 
					height: 400, width:1000,
					
      				});
*/
function SwitchOn()
 {
     chrome.alarms.create('Alarm', {
     periodInMinutes: 1,
     delayInMinutes:  2
	});
     console.log("Switch On function called" + Date());

 }

function SwitchOff() 
 {
    chrome.alarms.clear("Alarm");
    console.log("Switch Off function called" + Date() );

 }

 function showpopup()
{
 if(ExtensionOn)
 {
	chrome.browserAction.onClicked(function(evt) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "show the popup"});
  });
 });
}
}
/*
	if(ExtensionOn)
	{
		alert("Inside function showpopup" + Date());
		console.log("alert shown");
		console.log("Is extension on?" + ExtensionOn);
	}
}
	*/


function click(e)
{
	if(ExtensionOn)
	{
		SwitchOff();
		console.log("switched off" + Date());
		chrome.browserAction.setBadgeText({text: "Off"});
		
	}

	else
	{
		SwitchOn();
		console.log("switched on");
		chrome.browserAction.setBadgeText({text: "ON"});


		// Replace 15.0 with user selected time in minutes	

	}
	//Toggle ExtensionOn
	ExtensionOn = !ExtensionOn;

	

}


chrome.runtime.onInstalled.addListener(SwitchOn);

chrome.alarms.onAlarm.addListener(showpopup);

chrome.browserAction.onClicked.addListener(click);


