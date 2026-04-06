const DEFAULTS = {
  timer: "15mins",
  displaymessage: "Focus. Don't get distracted",
};

window.onload = async function () {
  const data = await chrome.storage.local.get(["timer", "displaymessage"]);
  const timer = data.timer ?? DEFAULTS.timer;
  const displaymessage = data.displaymessage ?? DEFAULTS.displaymessage;

  const select = document.getElementById("timer");
  for (const child of select.children) {
    if (child.value === timer) {
      child.selected = true;
      break;
    }
  }

  document.getElementById("displaymessage").value = displaymessage;

  document.getElementById("restore").onclick = async function () {
    await chrome.storage.local.remove([
      "timer",
      "displaymessage",
      "extensionOn",
    ]);
    chrome.runtime.reload();
  };

  document.getElementById("save").onclick = async function () {
    const userTimer = select.children[select.selectedIndex].value;
    const userMessage = document.getElementById("displaymessage").value;
    await chrome.storage.local.set({
      timer: userTimer,
      displaymessage: userMessage,
    });
    chrome.runtime.reload();
  };
};
