# KaTeX to Word Equation Converter

<div align="center">

![Extension Logo](https://github.com/xMrPhede/KaTeXGPT/blob/main/icons/icon128.png)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/maojnknofbadmhfkbllhpddhophjhblo)](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/maojnknofbadmhfkbllhpddhophjhblo)](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
[![GitHub license](https://img.shields.io/github/license/xmrphede/KaTeXGPT)](https://github.com/xmrphede/KaTeXGPT/blob/main/LICENSE)

</div>

## 🚀 Overview

**KaTeX to Word Equation Converter** is a browser extension that converts KaTeX-rendered mathematical expressions into **Microsoft Word-compatible MathML** format.

Originally built for **ChatGPT**, the extension now supports **Deepseek**, **Perplexity**, **Claude**, and **Gemini**, making it the most versatile tool for AI-generated math content.

## ✨ Features

* **One-Click Conversion**: Instantly convert equations rendered by ChatGPT, Deepseek, Perplexity, Claude, or Gemini into Word-compatible MathML.
* **Multi-Platform Support**: Works seamlessly across all supported AI chat platforms.
* **Visual Feedback**: See clear visual cues when equations are copied successfully.
* **Simple Interface**: No setup required—just click and paste.
* **Word Compatible**: Paste directly into Microsoft Word or Google Docs for perfectly formatted equations.

## 📥 Installation

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
2. Click **“Add to Chrome”**
3. Confirm the installation

Or install manually:

```bash
git clone https://github.com/xmrphede/KaTeXGPT.git
cd KaTeXGPT
```

Then:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **“Load unpacked”**
4. Select the `extension` directory

## 🎯 How to Use

1. Open **ChatGPT**, **Deepseek**, **Perplexity**, **Claude**, or **Gemini**
2. Find any KaTeX-rendered mathematical equation
3. Click the equation to copy it
4. Paste it directly into **Microsoft Word**
5. The equation will be perfectly formatted—no edits needed!

### Building

1. Clone the repository:

```bash
git clone https://github.com/xmrphede/KaTeXGPT.git
```

2. Make your changes
3. Test locally:

   * Open `chrome://extensions/`
   * Enable Developer mode
   * Click “Load unpacked”
   * Select the extension directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to improve compatibility with new AI platforms or add additional features.

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Federico Granata

* GitHub: [@xMrPhede](https://github.com/xMrPhede)
* Twitter: [@holygranats](https://twitter.com/holygranats)

## 🙏 Support

If you find this extension helpful, consider:

* ⭐ Starring the repository
* 🐛 Reporting bugs
* 💡 Suggesting new features
* ☕ [Buying me a coffee](https://www.buymeacoffee.com/xmrphede)

## 📄 Privacy Policy

This extension does **not collect or transmit** any personal data. All usage data is stored locally on your device.

## 🐛 Known Bugs

~~When pasting equations with large operators (Σ, Π, ∫), the index variable appeared twice.~~ ✅ **Fixed**
~~Matrix equations pasted as raw MathML text.~~ ✅ **Fixed**

---

<div align="center">
Made with ❤️ by Federico Granata
</div>