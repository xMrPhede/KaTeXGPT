# KaTeX to Word Equation Converter

<div align="center">

![Extension Logo](https://github.com/xMrPhede/KaTeXGPT/blob/main/icons/icon128.png)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/maojnknofbadmhfkbllhpddhophjhblo)](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/maojnknofbadmhfkbllhpddhophjhblo)](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
[![GitHub license](https://img.shields.io/github/license/xmrphede/KaTeXGPT)](https://github.com/xmrphede/KaTeXGPT/blob/main/LICENSE)

</div>

## 🚀 Features

- **One-Click Conversion**: Convert ChatGPT's KaTeX equations to Word-compatible MathML format
- **Visual Feedback**: Clear indication when equations are copied
- **Simple Interface**: No configuration needed - just click and paste
- **Word Compatible**: Equations paste perfectly into Microsoft Word

## 📥 Installation

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/maojnknofbadmhfkbllhpddhophjhblo)
2. Click "Add to Chrome"
3. Confirm the installation

Or install manually:
1. Clone the repository:
```bash
git clone https://github.com/xmrphede/KaTeXGPT.git
cd KaTeXGPT
```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" in the top left
5. Select the `extension` directory from the cloned repository

## 🎯 How to Use

1. Open [ChatGPT](https://chat.openai.com)
2. Find any mathematical equation
3. Click the equation to copy it
4. Paste directly into Microsoft Word
5. The equation will be perfectly formatted!

### Building
1. Clone the repository:
```bash
git clone https://github.com/xmrphede/KaTeXGPT.git
```

2. Make your changes

3. Test locally:
- Open `chrome://extensions/`
- Enable Developer mode
- Click "Load unpacked"
- Select the extension directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Federico Granata
- GitHub: [@xMrPhede](https://github.com/xMrPhede)
- Twitter: [@holygranats](https://twitter.com/holygranats)

## 🙏 Support

If you find this extension helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- ☕ [Buying me a coffee](https://www.buymeacoffee.com/xmrphede)

## 📄 Privacy Policy

This extension does not collect any personal data. All achievement data is stored locally on your device.

## 🐛 Known Bugs

~~- When pasting equations with large operators (Σ, Π, ∫), the intended index variable appears alongside the placeholder rather than replacing it. For example, in a summation, you'll see both the placeholder and the indexed variable 'xi' instead of just 'xi'.~~ ✅ Fixed
- Matrixes are not correctly rendered in Word, pasting them will result in a bunch of MathML text

<div align="center">
Made with ❤️ by Federico Granata
</div>
