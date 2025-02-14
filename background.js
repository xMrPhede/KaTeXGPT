chrome.action.onClicked.addListener((tab) => {
  if (
    tab.url.includes("chatgpt.com/") ||
    tab.url.includes("chat.deepseek.com")
  ) {
    chrome.tabs.sendMessage(tab.id, { action: "PROMPT" });
  }
});
