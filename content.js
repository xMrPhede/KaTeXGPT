class KatexGPT {
  constructor() {
    console.log("🚀 KatexGPT Extension initialized");

    // Initialize properties
    this.dayMilestones = [7, 30, 90, 180, 365, 500, 730, 1000, 1500];
    this.copyMilestones = [10, 50, 100, 300, 500, 1000, 1250, 1500, 1750, 2000];
    this.totalCopies = 0;
    this.reachedDayMilestones = [];
    this.reachedCopyMilestones = [];

    // Initialize features
    this.initializeStats();
    this.createPopup();
    this.enableObserver();
  }

  createPopup() {
    console.log("Creating popup...");

    // Create main popup container
    const popup = document.createElement("div");
    popup.id = "coffee-popup";
    popup.className = "coffee-popup";

    // Create content
    const content = document.createElement("div");
    content.className = "coffee-content";

    // Add title
    const title = document.createElement("h3");
    title.textContent = "🎉 Achievement Unlocked! ☕";
    content.appendChild(title);

    // Add milestone message container
    const milestoneMsg = document.createElement("p");
    milestoneMsg.id = "milestone-message";
    content.appendChild(milestoneMsg);

    // Add description
    const desc = document.createElement("p");
    desc.textContent =
      "If you find this tool helpful, consider buying me a coffee!";
    content.appendChild(desc);

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "coffee-buttons";

    // Add Coffee button
    const coffeeBtn = document.createElement("a");
    coffeeBtn.href = "https://www.buymeacoffee.com/xmrphede";
    coffeeBtn.target = "_blank";
    coffeeBtn.className = "coffee-btn";
    coffeeBtn.textContent = "Buy Me a Coffee";
    buttonsContainer.appendChild(coffeeBtn);

    // Add Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.textContent = "Maybe Later";
    closeBtn.onclick = () => (popup.style.display = "none");
    buttonsContainer.appendChild(closeBtn);
    content.appendChild(buttonsContainer);

    // Add bug report link
    const bugReport = document.createElement("a");
    bugReport.href =
      "mailto:info@federicogranata.it?subject=Bug%20Report%20for%20KatexGPT";
    bugReport.className = "bug-report";
    bugReport.textContent = "Report a bug";
    content.appendChild(bugReport);

    // Create social links
    const socialLinks = document.createElement("div");
    socialLinks.className = "social-links";

    // Add social icons
    const socials = [
      {
        platform: "twitter",
        url: "https://twitter.com/holygranats",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
      },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/federico-granata/",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
      },
      {
        platform: "github",
        url: "https://github.com/xMrPhede",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
      },
    ];

    socials.forEach((social) => {
      const link = document.createElement("a");
      link.href = social.url;
      link.target = "_blank";
      link.className = "social-link";
      link.innerHTML = social.icon;
      socialLinks.appendChild(link);
    });

    content.appendChild(socialLinks);
    popup.appendChild(content);

    // Add popup to page
    document.body.appendChild(popup);
    console.log("Popup created successfully");
  }

  enableObserver() {
    const observer = new MutationObserver(() => {
      this.createCopyEquationButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.log("Observer enabled");
  }

  // Helper: robust clipboard fallback
  copyToClipboard(textToCopy) {
    return navigator.clipboard
      .writeText(textToCopy)
      .catch(() => {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.top = "-1000px";
          document.body.appendChild(textarea);
          textarea.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!ok) {
            return Promise.reject(new Error("execCommand copy failed"));
          }
        } catch (e) {
          return Promise.reject(e);
        }
        return Promise.resolve();
      });
  }

  updateStats() {
    this.totalCopies++;
    localStorage.setItem("totalCopies", this.totalCopies.toString());
    this.checkCopyMilestones();
  }

  sanitizeMathMLForWord(mathMLString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(mathMLString, "application/xml");

    // Word doesn't support <semantics> or <annotation>, strip them
    const semanticsElements = xmlDoc.getElementsByTagName("semantics");
    for (let sem of Array.from(semanticsElements)) {
      // Move all children except <annotation> out of <semantics>
      const children = Array.from(sem.childNodes);
      children.forEach((child) => {
        if (
          child.nodeName !== "annotation" &&
          child.nodeName !== "annotation-xml"
        ) {
          sem.parentNode.insertBefore(child, sem);
        }
      });
      sem.parentNode.removeChild(sem);
    }

    // Remove any remaining standalone <annotation> elements
    const annotations = xmlDoc.querySelectorAll("annotation, annotation-xml");
    annotations.forEach((ann) => ann.parentNode?.removeChild(ann));

    // Attributes Word doesn't support
    const unsupportedAttrs = [
      "mathvariant", "lspace", "rspace", "accent", "accentunder",
      "align", "columnalign", "columnlines", "columnspacing", "columnwidth",
      "equalcolumns", "equalrows", "frame", "rowalign", "rowlines",
      "rowspacing", "side", "minlabelspacing", "charalign", "charspacing",
      "linethickness", "bevelled", "notation", "longdivstyle", "actuarial",
      "radical", "stretchy", "symmetric", "maxsize", "minsize", "largeop",
      "movablelimits", "form", "separator", "fence", "linebreak",
      "lineleading", "linebreakstyle", "linebreakmultchar", "indentalign",
      "indentshift", "indenttarget", "indentalignfirst", "indentalignlast",
      "indentshiftfirst", "indentshiftlast",
    ];

    const allElements = xmlDoc.getElementsByTagName("*");
    for (let el of Array.from(allElements)) {
      unsupportedAttrs.forEach((attr) => el.removeAttribute(attr));
    }

    // Replace prime entities (′, ″, ‴) with simple apostrophes
    const moElements = xmlDoc.getElementsByTagName("mo");
    for (let mo of Array.from(moElements)) {
      const content = mo.textContent.trim();
      if (
        content === "′" || content === "&#x2032;" || content === "&#8242;" ||
        content === "″" || content === "&#x2033;" || content === "&#8243;" ||
        content === "‴" || content === "&#x2034;" || content === "&#8244;" ||
        content === "'" || content === "&#x27;"
      ) {
        const primeCount =
          content === "″" || content === "&#x2033;" || content === "&#8243;"
            ? 2
            : content === "‴" || content === "&#x2034;" || content === "&#8244;"
            ? 3
            : 1;
        mo.textContent = "'".repeat(primeCount);
      }
    }

    // Replace non-breaking spaces with regular spaces (Word dislikes NBSPs in MathML)
    const textNodes = xmlDoc.evaluate(
      "//text()",
      xmlDoc,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0; i < textNodes.snapshotLength; i++) {
      const node = textNodes.snapshotItem(i);
      if (node.nodeValue) {
        node.nodeValue = node.nodeValue.replace(/\u00A0/g, " ");
      }
    }

    return new XMLSerializer().serializeToString(xmlDoc);
  }

  createCopyEquationButtons() {
    // Only select equations that haven't been processed yet
    const allCandidates = Array.from(
      document.querySelectorAll(
        ".katex:not(.kgpt-processed), .katex-display:not(.kgpt-processed)"
      )
    );
    // Prefer binding to inner .katex if present; avoid double-binding .katex-display that contains a .katex child
    const equations = allCandidates.filter((el) => {
      if (el.classList.contains("katex-display")) {
        return !el.querySelector(".katex");
      }
      return true;
    });

    equations.forEach((equation) => {
      equation.style.cursor = "pointer";
      equation.classList.add("kgpt-processed");
      equation.classList.add("copyable-equation");

      // Capture-phase listener to bypass site-level stopPropagation
      equation.addEventListener(
        "click",
        (evt) => {
          // Do not interfere with text selection drags
          if (window.getSelection && String(window.getSelection())) return;

          chrome.storage.local.get(["outputFormat", "latexDelimiter"], (result) => {
            if (result.outputFormat === "latex") {
              this.handleLatexCopy(equation, result.latexDelimiter);
            } else {
              this.handleMathmlCopy(equation);
            }
          });
        },
        true
      );
    });
  }

  getTexSource(equation) {
    // 1) Standard KaTeX semantics annotation location
    const katexMathml =
        equation.querySelector(".katex-mathml") ||
        equation.closest(".katex, .katex-display")?.querySelector(".katex-mathml");
    
    if (katexMathml) {
        const annotation = katexMathml.querySelector(
            'annotation[encoding="application/x-tex"]'
        );
        if (annotation && annotation.textContent) {
            return annotation.textContent;
        }
    }

    // 2) Common fallbacks used by hosts
    const ariaTex =
      equation.getAttribute("aria-label") ||
      (equation.closest(".katex-display, .katex") &&
        equation
          .closest(".katex-display, .katex")
          .getAttribute("aria-label"));

    const dataTexEl =
      equation.closest(
        '*[data-tex], *[data-latex], *[data-math], *[data-equation], *[data-original], *[data-original-tex], *[data-source]'
      ) || equation;
    
    const dataTex =
      dataTexEl?.getAttribute("data-tex") ||
      dataTexEl?.getAttribute("data-latex") ||
      dataTexEl?.getAttribute("data-math") ||
      dataTexEl?.getAttribute("data-equation") ||
      dataTexEl?.getAttribute("data-original-tex") ||
      dataTexEl?.getAttribute("data-original") ||
      dataTexEl?.getAttribute("data-source") ||
      equation.dataset?.tex;

    const scriptTex =
      (equation.closest(".katex-display, .katex") &&
        equation
          .closest(".katex-display, .katex")
          .querySelector('script[type="math/tex"], script[type="math/latex"]')
          ?.textContent) ||
      null;

    return ariaTex || dataTex || scriptTex || null;
  }

  handleLatexCopy(equation, delimiter) {
    let latex = this.getTexSource(equation);

    if (latex) {
        let formattedLatex = latex;
        switch (delimiter) {
          case "brackets":
            formattedLatex = `\\[${latex}\\]`;
            break;
          case "doubledollar":
            formattedLatex = `$$${latex}$$`;
            break;
          case "dollar":
          default:
            formattedLatex = `$${latex}$`;
            break;
        }

        console.log("📋 Copying LaTeX to clipboard:", formattedLatex);
        this.copyToClipboard(formattedLatex)
        .then(() => {
          console.log("✅ LaTeX copied to clipboard");
          this.updateStats();
          this.showCopyFeedback(equation);
        })
        .catch((err) => {
          console.error("❌ Failed to copy LaTeX:", err);
        });
    } else {
        // Try to recover via heuristic if direct source failed
        const recoveredTex = this.extractTexFromKatexHtml(equation);
        if (recoveredTex) {
            let formattedLatex = recoveredTex;
            switch (delimiter) {
              case "brackets":
                formattedLatex = `\\[${recoveredTex}\\]`;
                break;
              case "doubledollar":
                formattedLatex = `$$${recoveredTex}$$`;
                break;
              case "dollar":
              default:
                formattedLatex = `$${recoveredTex}$`;
                break;
            }
            console.log("📋 Copying recovered LaTeX to clipboard:", formattedLatex);
            this.copyToClipboard(formattedLatex)
                .then(() => {
                    console.log("✅ Recovered LaTeX copied");
                    this.updateStats();
                    this.showCopyFeedback(equation);
                });
        } else {
            console.warn("LaTeX source not found, falling back to MathML");
            // Fallback to MathML if explicit LaTeX request fails completely
            this.handleMathmlCopy(equation);
        }
    }
  }

  extractTexFromKatexHtml(root) {
      const container =
        root.querySelector(".katex-html") ||
        (root.closest(".katex-display, .katex") &&
          root
            .closest(".katex-display, .katex")
            .querySelector(".katex-html"));
      if (!container) return null;
      const structuralPattern =
        /(katex-html|base|strut|pstrut|vlist|vlist-t|vlist-r|sizing)/;
      const tokenPattern =
        /(mord|mop|mbin|mrel|mpunct|mopen|mclose|text|mspace)/;
      const harvest = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue || "";
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return "";
        const el = node;
        const cls = el.className || "";
        if (structuralPattern.test(cls)) {
          return Array.from(el.childNodes).map(harvest).join("");
        }
        if (cls.includes("msupsub")) {
          // Treat as a superscript by default
          const supText = Array.from(el.childNodes)
            .map(harvest)
            .join("")
            .trim();
          return `^{${supText}}`;
        }
        if (tokenPattern.test(cls)) {
          // Keep spacing around relation/binary operators
          let content = Array.from(el.childNodes).map(harvest).join("");
          if (cls.includes("mrel") || cls.includes("mbin")) {
            content = ` ${content.trim()} `;
          }
          return content;
        }
        return Array.from(el.childNodes).map(harvest).join("");
      };
      let tex = harvest(container);
      tex = tex.replace(/\s+/g, " ").replace(/−/g, "-").trim();
      return tex || null;
  }

  handleMathmlCopy(equation) {
    // Aggressively find the <math> element, ignoring HTML wrappers
    let mathElement = null;

    // Strategy 1: Direct query from clicked element
    mathElement = equation.querySelector("math");

    // Strategy 2: Walk up to .katex or .katex-display container and find <math>
    if (!mathElement) {
      const container = equation.closest(".katex, .katex-display");
      if (container) {
        mathElement = container.querySelector("math");
      }
    }

    // Strategy 3: Check if clicked element itself is <math>
    if (
      !mathElement &&
      equation.tagName &&
      equation.tagName.toLowerCase() === "math"
    ) {
      mathElement = equation;
    }

    // Strategy 4: Check siblings
    if (!mathElement && equation.parentElement) {
      mathElement = equation.parentElement.querySelector("math");
    }

    // Strategy 5: Look inside .katex-mathml specifically
    if (!mathElement) {
      const katexMathml =
        equation.querySelector(".katex-mathml") ||
        equation.closest(".katex, .katex-display")?.querySelector(".katex-mathml");
      if (katexMathml) {
        mathElement = katexMathml.querySelector("math");
      }
    }

    // If we didn't find MathML, try to recover TeX and render MathML via KaTeX
    let generatedFromTex = false;
    if (!mathElement) {
      const texSource = this.getTexSource(equation);

      if (texSource && typeof katex !== "undefined" && katex.renderToString) {
        try {
          let mathMLString = katex
            .renderToString(texSource, { output: "mathml" })
            .replaceAll("&nbsp;", " ")
            .replaceAll("&", "&amp;");
          mathMLString = this.sanitizeMathMLForWord(mathMLString);
          generatedFromTex = true;
          this.copyToClipboard(mathMLString)
            .then(() => {
              console.log("✅ MathML (from TeX) copied to clipboard");
              this.updateStats();
              this.showCopyFeedback(equation);
            })
            .catch((err) => {
              console.error("❌ Failed to copy equation (from TeX):", err);
            });
        } catch (e) {
          console.error("❌ KaTeX renderToString failed on recovered TeX:", e);
        }
      } else if (!texSource) {
        // 3) Last-resort: derive TeX heuristically from KaTeX HTML, then render to MathML
        try {
          const texFromHtml = this.extractTexFromKatexHtml(equation);
          if (
            texFromHtml &&
            typeof katex !== "undefined" &&
            katex.renderToString
          ) {
            let mathMLString = katex
              .renderToString(texFromHtml, { output: "mathml" })
              .replaceAll("&nbsp;", " ")
              .replaceAll("&", "&amp;");
            mathMLString = this.sanitizeMathMLForWord(mathMLString);
            generatedFromTex = true;
            this.copyToClipboard(mathMLString)
              .then(() => {
                console.log("✅ MathML (from katex-html heuristic) copied");
                this.updateStats();
                this.showCopyFeedback(equation);
              })
              .catch((err) => {
                console.error(
                  "❌ Failed to copy equation (from katex-html heuristic):",
                  err
                );
              });
          } else {
            console.warn(
              "No MathML/TeX source and katex-html heuristic failed to extract TeX."
            );
          }
        } catch (err) {
          console.error("❌ katex-html to MathML heuristic failed:", err);
        }
      }
    }

    // If we found MathML in DOM, proceed with original flow
    if (!generatedFromTex && mathElement) {
      console.log(
        "🔍 Found mathElement, nodeName:",
        mathElement.nodeName,
        "tagName:",
        mathElement.tagName
      );

      // Ensure we're extracting ONLY the <math> element, not any wrapper
      if (mathElement.nodeName.toLowerCase() !== "math") {
        console.warn(
          "⚠️ mathElement is not <math>, it's:",
          mathElement.nodeName,
          "- searching for <math> inside"
        );
        mathElement = mathElement.querySelector("math");
      }

      if (!mathElement) {
        console.error(
          "❌ Could not locate <math> element after extraction attempt"
        );
        return;
      }

      console.log("✓ Confirmed mathElement is <math>, proceeding to serialize");

      let mathMLString = new XMLSerializer()
        .serializeToString(mathElement)
        .replaceAll("&nbsp;", " ")
        .replaceAll("&", "&amp;");

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(mathMLString, "application/xml");

      function transformMfencedElements(xmlDoc) {
        const mathNS = "http://www.w3.org/1998/Math/MathML";
        const mrowElements = Array.from(xmlDoc.getElementsByTagName("mrow"));

        mrowElements.forEach((mrow) => {
          const elementChildren = Array.from(mrow.childNodes).filter(
            (node) => node.nodeType === Node.ELEMENT_NODE
          );

          if (
            elementChildren.length > 0 &&
            elementChildren[0].nodeName === "mo" &&
            elementChildren[0].getAttribute("fence") === "true"
          ) {
            const openFence = elementChildren[0].textContent.trim();
            let closeFence = "";
            let contentNodes;

            if (
              elementChildren.length > 1 &&
              elementChildren[elementChildren.length - 1].nodeName === "mo" &&
              elementChildren[elementChildren.length - 1].getAttribute(
                "fence"
              ) === "true"
            ) {
              closeFence = elementChildren[
                elementChildren.length - 1
              ].textContent.trim();
              contentNodes = elementChildren.slice(
                1,
                elementChildren.length - 1
              );
            } else {
              contentNodes = elementChildren.slice(1);
            }

            const mfenced = xmlDoc.createElementNS(mathNS, "mfenced");
            mfenced.setAttribute("open", openFence);
            mfenced.setAttribute("close", closeFence);
            mfenced.setAttribute("separators", "");

            contentNodes.forEach((node) => {
              mfenced.appendChild(node);
            });

            mrow.parentNode.replaceChild(mfenced, mrow);
          }
        });
      }

      transformMfencedElements(xmlDoc);
      mathMLString = new XMLSerializer().serializeToString(xmlDoc);
      mathMLString = this.sanitizeMathMLForWord(mathMLString);

      console.log(
        "📋 Copying MathML to clipboard:",
        mathMLString.substring(0, 200) + "..."
      );

      this.copyToClipboard(mathMLString)
        .then(() => {
          console.log(
            "✅ MathML copied to clipboard (length:",
            mathMLString.length,
            "chars)"
          );
          this.updateStats();
          this.showCopyFeedback(equation);
        })
        .catch((err) => {
          console.error("❌ Failed to copy equation:", err);
        });
    } else if (!generatedFromTex && !mathElement) {
      console.warn(
        "No MathML or TeX could be resolved for clicked KaTeX node."
      );
    }
  }

  showCopyFeedback(equation) {
    // Add a brief visual feedback when copying
    equation.style.transition = "transform 0.2s ease";
    equation.style.transform = "scale(1.05)";

    // Create and show a temporary "Copied!" message
    const feedback = document.createElement("div");
    feedback.textContent = "Copied!";
    feedback.style.cssText = `
            position: absolute;
            background: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            transform: translateY(-100%);
            margin-top: -4px;
            z-index: 1000;
        `;

    equation.style.position = "relative";
    equation.appendChild(feedback);

    // Animate the feedback
    requestAnimationFrame(() => {
      feedback.style.opacity = "1";

      setTimeout(() => {
        equation.style.transform = "scale(1)";
        feedback.style.opacity = "0";

        // Clean up
        setTimeout(() => {
          feedback.remove();
        }, 200);
      }, 500);
    });
  }
  initializeStats() {
    if (!localStorage.getItem("installDate")) {
      localStorage.setItem("installDate", new Date().toISOString());
    }

    this.totalCopies = parseInt(localStorage.getItem("totalCopies")) || 0;
    this.reachedDayMilestones =
      JSON.parse(localStorage.getItem("reachedDayMilestones")) || [];
    this.reachedCopyMilestones =
      JSON.parse(localStorage.getItem("reachedCopyMilestones")) || [];

    console.log("Stats initialized:", {
      copies: this.totalCopies,
      dayMilestones: this.reachedDayMilestones,
      copyMilestones: this.reachedCopyMilestones,
    });

    this.checkDayMilestones();
  }

  showMilestonePopup(type, value) {
    const messageElement = document.getElementById("milestone-message");
    if (!messageElement) {
      console.error("Milestone message element not found");
      return;
    }

    let message =
      type === "days"
        ? `You've been using this extension for <span class="highlight">${value} days</span>!`
        : `You've converted <span class="highlight">${value} equations</span>!`;

    messageElement.innerHTML = message;
    this.showPopup();
  }

  showPopup() {
    const popup = document.getElementById("coffee-popup");
    if (popup) {
      popup.style.display = "block";
      this.triggerConfetti();
      console.log("Popup shown");
    } else {
      console.error("Popup element not found");
    }
  }

  triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 10000,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

  checkDayMilestones() {
    const installDate = new Date(localStorage.getItem("installDate"));
    const daysSinceInstall = Math.floor(
      (new Date() - installDate) / (1000 * 60 * 60 * 24)
    );

    this.dayMilestones.forEach((days) => {
      const milestoneId = `day-${days}`;
      if (
        daysSinceInstall >= days &&
        !this.reachedDayMilestones.includes(milestoneId)
      ) {
        this.reachedDayMilestones.push(milestoneId);
        localStorage.setItem(
          "reachedDayMilestones",
          JSON.stringify(this.reachedDayMilestones)
        );
        this.showMilestonePopup("days", days);
      }
    });
  }

  checkCopyMilestones() {
    this.copyMilestones.forEach((copies) => {
      const milestoneId = `copy-${copies}`;
      if (
        this.totalCopies >= copies &&
        !this.reachedCopyMilestones.includes(milestoneId)
      ) {
        this.reachedCopyMilestones.push(milestoneId);
        localStorage.setItem(
          "reachedCopyMilestones",
          JSON.stringify(this.reachedCopyMilestones)
        );
        this.showMilestonePopup("copies", copies);
      }
    });
  }
}

// Initialize the extension
console.log("Starting KatexGPT Extension...");
const katexGPT = new KatexGPT();
