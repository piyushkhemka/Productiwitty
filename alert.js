chrome.alarms.onAlarm.addListener(showpopup);

function showpopup()
{
	alert("Inside popup -- making sure");
	console.log("alert shown");
}