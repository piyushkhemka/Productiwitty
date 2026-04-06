const DEFAULTS = {
  timer: "15mins",
  displaymessage: "Focus. Don't get distracted",
  extensionOn: true,
};

const TIMER_MAP = {
  "1mins": 1,
  "5mins": 5,
  "10mins": 10,
  "15mins": 15,
  "30mins": 30,
  "60mins": 60,
  "180mins": 180,
  "360mins": 360,
};

async function getSettings() {
  const data = await chrome.storage.local.get([
    "timer",
    "displaymessage",
    "extensionOn",
  ]);
  return {
    timer: data.timer ?? DEFAULTS.timer,
    displaymessage: data.displaymessage ?? DEFAULTS.displaymessage,
    extensionOn: data.extensionOn ?? DEFAULTS.extensionOn,
  };
}

async function switchOn(timerKey) {
  const minutes = TIMER_MAP[timerKey] ?? 15;
  await chrome.alarms.clear("Alarm");
  chrome.alarms.create("Alarm", {
    periodInMinutes: minutes,
    delayInMinutes: minutes,
  });
}

async function switchOff() {
  await chrome.alarms.clear("Alarm");
}

async function showpopup() {
  const { extensionOn, displaymessage } = await getSettings();
  if (!extensionOn) {
    await switchOff();
    return;
  }

  let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  let tab = tabs.find((t) => t.url?.startsWith("http"));
  if (!tab) {
    tabs = await chrome.tabs.query({ active: true, windowType: "normal" });
    tab = tabs.find((t) => t.url?.startsWith("http"));
  }
  if (!tab) return;
  const tabId = tab.id;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["raisealert.js"],
      world: "MAIN",
    });
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (message) => {
        swal({ title: message, icon: "success", button: "OK" });
      },
      args: [displaymessage],
      world: "MAIN",
    });
  } catch (err) {
    console.error("Productiwitty: failed to show alert:", err);
  }
}

async function handleClick() {
  const { extensionOn, timer } = await getSettings();
  const newState = !extensionOn;
  await chrome.storage.local.set({ extensionOn: newState });

  if (newState) {
    await switchOn(timer);
    chrome.action.setIcon({ path: "images/green128.png" });
    chrome.action.setBadgeText({ text: "On" });
  } else {
    await switchOff();
    chrome.action.setIcon({ path: "images/red128.png" });
    chrome.action.setBadgeText({ text: "Off" });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const { timer } = await getSettings();
  await chrome.storage.local.set({ extensionOn: true });
  await switchOn(timer);
  chrome.action.setIcon({ path: "images/green128.png" });
  chrome.action.setBadgeText({ text: "On" });
});

chrome.alarms.onAlarm.addListener(showpopup);
chrome.action.onClicked.addListener(handleClick);
