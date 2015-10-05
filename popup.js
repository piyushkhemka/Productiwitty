function SwitchOn(e)
 {
     chrome.alarms.create("Alarm", {delayInMinutes: 0.1, periodInMinutes: 1} );
     window.close();
 }

function SwitchOff(e) 
 {
    chrome.alarms.clear("Alarm");
    window.close();
 },

function setup()
 {
    var a = document.getElementById('alarmOn');
    a.addEventListener('click',  SwitchOn);
    var a = document.getElementById('alarmOff');
     a.addEventListener('click',  SwitchOff );
}
};

document.addEventListener('DOMContentLoaded',setup());