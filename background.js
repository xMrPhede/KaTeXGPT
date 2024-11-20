chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("chat.openai.com")) {
      chrome.tabs.sendMessage(tab.id, { action: "PROMPT" });
    }
  });