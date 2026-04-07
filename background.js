const DEFAULTS = {
  timer: "15mins",
  displaymessage: "Focus. Don't get distracted",
  extensionOn: true,
  soundEnabled: true,
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
    "soundEnabled",
  ]);
  return {
    timer: data.timer ?? DEFAULTS.timer,
    displaymessage: data.displaymessage ?? DEFAULTS.displaymessage,
    extensionOn: data.extensionOn ?? DEFAULTS.extensionOn,
    soundEnabled: data.soundEnabled ?? DEFAULTS.soundEnabled,
  };
}

async function updateCountdownBadge() {
  const alarm = await chrome.alarms.get("Alarm");
  if (!alarm) return;
  const minutesLeft = Math.round((alarm.scheduledTime - Date.now()) / 60000);
  chrome.action.setBadgeText({
    text: minutesLeft <= 0 ? "now" : `${minutesLeft}m`,
  });
}

async function switchOn(timerKey) {
  const minutes = TIMER_MAP[timerKey] ?? 15;
  await chrome.alarms.clear("Alarm");
  await chrome.alarms.clear("CountdownTick");
  chrome.alarms.create("Alarm", {
    periodInMinutes: minutes,
    delayInMinutes: minutes,
  });
  chrome.alarms.create("CountdownTick", {
    periodInMinutes: 1,
    delayInMinutes: 1,
  });
  await updateCountdownBadge();
}

async function switchOff() {
  await chrome.alarms.clear("Alarm");
  await chrome.alarms.clear("CountdownTick");
}

async function showpopup() {
  const { extensionOn, displaymessage, soundEnabled } = await getSettings();
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

  const hour = new Date().getHours();

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (message, hour, soundEnabled) => {
        if (document.getElementById("productiwitty-overlay")) return;

        // Chime via Web Audio API
        if (soundEnabled) {
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              ctx.currentTime + 0.8,
            );
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.8);
          } catch (e) {}
        }

        // Context-aware greeting
        function getGreeting(h) {
          if (h >= 5 && h < 12) return "Good morning";
          if (h >= 12 && h < 17) return "Good afternoon";
          if (h >= 17 && h < 21) return "Good evening";
          return "Still up?";
        }

        const style = document.createElement("style");
        style.textContent = `
          #productiwitty-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          }
          #productiwitty-modal {
            background: white; border-radius: 16px; padding: 48px 40px;
            text-align: center; max-width: 420px; width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: productiwitty-in 0.2s ease;
          }
          @keyframes productiwitty-in {
            from { opacity: 0; transform: scale(0.9); }
            to   { opacity: 1; transform: scale(1); }
          }
          #productiwitty-greeting {
            font-size: 12px; color: #aaa; text-transform: uppercase;
            letter-spacing: 0.12em; margin: 0 0 10px; font-weight: 600;
          }
          #productiwitty-modal h2 {
            font-size: 22px; color: #333; margin: 0 0 28px; font-weight: 600;
          }
          #productiwitty-btn {
            background: #4caf50; color: white; border: none;
            padding: 12px 32px; border-radius: 8px; font-size: 16px;
            cursor: pointer; font-weight: 600;
          }
          #productiwitty-btn:hover { background: #45a049; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement("div");
        overlay.id = "productiwitty-overlay";

        const modal = document.createElement("div");
        modal.id = "productiwitty-modal";

        const greeting = document.createElement("p");
        greeting.id = "productiwitty-greeting";
        greeting.textContent = getGreeting(hour);

        const h2 = document.createElement("h2");
        h2.textContent = message;

        const btn = document.createElement("button");
        btn.id = "productiwitty-btn";
        btn.textContent = "OK";

        function dismiss() {
          overlay.remove();
          document.removeEventListener("keydown", onKey);
        }
        function onKey(e) {
          if (e.key === "Escape") dismiss();
        }

        btn.onclick = dismiss;
        overlay.onclick = (e) => {
          if (e.target === overlay) dismiss();
        };
        document.addEventListener("keydown", onKey);

        modal.appendChild(greeting);
        modal.appendChild(h2);
        modal.appendChild(btn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      },
      args: [displaymessage, hour, soundEnabled],
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
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "Alarm") {
    await showpopup();
    await updateCountdownBadge();
  } else if (alarm.name === "CountdownTick") {
    const { extensionOn } = await getSettings();
    if (extensionOn) await updateCountdownBadge();
  }
});

chrome.action.onClicked.addListener(handleClick);
