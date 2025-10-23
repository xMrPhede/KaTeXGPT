chrome.action.onClicked.addListener((tab) => {
  if (
    tab.url.includes("chatgpt.com/") ||
    tab.url.includes("chat.deepseek.com") ||
    tab.url.includes("perplexity.ai") ||
    tab.url.includes("claude.ai") ||
    tab.url.includes("gemini.google.com") 
  ) {
    chrome.tabs.sendMessage(tab.id, { action: "PROMPT" });
  }
});
