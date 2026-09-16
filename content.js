// Containers that wrap a single assistant reply, most specific first. The last
// two are generic markdown bodies used as a fallback when a provider changes
// its markup.
const MESSAGE_CONTAINERS = [
  '[data-message-author-role="assistant"]', // ChatGPT
  ".font-claude-response", // Claude
  "message-content", // Gemini
  '[data-testid="answer"]', // Perplexity
  ".markdown",
  ".prose",
];

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
      this.addMessageCopyButtons();
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

  stripKatexSpan(htmlString) {
    if (!htmlString.includes("katex")) return htmlString;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const math = doc.querySelector("math");

    if (math) {
      return new XMLSerializer().serializeToString(math);
    }
    return htmlString;
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

    // Attributes Word ignores. Verified against Word for Mac by pasting the
    // same equation with and without each one, so only attributes that change
    // nothing are listed here. Word DOES honour "accent"/"accentunder" (without
    // them \vec and \bar float off to one side instead of centering) and
    // "linethickness" (without it \binom gains a fraction bar), so those must
    // survive. Layout hints like "mathvariant", "columnalign" and "stretchy"
    // are kept for the same reason.
    const unsupportedAttrs = [
      "lspace", "rspace", "side", "minlabelspacing", "charalign", "charspacing",
      "longdivstyle", "actuarial", "linebreak", "lineleading",
      "linebreakstyle", "linebreakmultchar", "indentalign", "indentshift",
      "indenttarget", "indentalignfirst", "indentalignlast",
      "indentshiftfirst", "indentshiftlast",
    ];

    const allElements = xmlDoc.getElementsByTagName("*");
    for (let el of Array.from(allElements)) {
      unsupportedAttrs.forEach((attr) => el.removeAttribute(attr));
    }

    // Drop invisible control operators unless an invisible-times operator is
    // correctly placed in an <mrow>. KaTeX can emit controls inside fixed-arity
    // elements such as <msub>/<msup>, where they become an invalid extra child.
    const invisibleOps = ["\u2061", "\u2062", "\u2063", "\u2064"];

    // Replace prime entities (′, ″, ‴) with simple apostrophes
    const moElements = xmlDoc.getElementsByTagName("mo");
    for (let mo of Array.from(moElements)) {
      const content = mo.textContent.trim();
      if (
        invisibleOps.includes(content) &&
        !(content === "\u2062" && mo.parentNode?.nodeName === "mrow")
      ) {
        mo.parentNode?.removeChild(mo);
        continue;
      }
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

    // Non-breaking spaces are deliberately left alone. Word collapses ordinary
    // leading/trailing spaces inside <mtext>, so rewriting them turns
    // "\text{if } x \text{ then }" into "ifxthen".

    return new XMLSerializer().serializeToString(xmlDoc);
  }

  createCopyEquationButtons() {
    // Only select equations that haven't been processed yet
    const allCandidates = Array.from(
      document.querySelectorAll(
        ".katex:not(.kgpt-processed), .katex-display:not(.kgpt-processed), .katex-mathml:not(.kgpt-processed)"
      )
    );
    // Prefer binding to inner .katex if present; avoid double-binding .katex-display that contains a .katex child
    // Also ensure .katex-mathml is not already inside a .katex/.katex-display that we are handling
    const equations = allCandidates.filter((el) => {
      if (el.classList.contains("katex-display")) {
        return !el.querySelector(".katex");
      }
      if (el.classList.contains("katex-mathml")) {
        return !el.closest(".katex, .katex-display");
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

    // ChatGPT renders KaTeX with output:"html" (no <math>, no <annotation>) and
    // keeps the original TeX in data-math-source on the wrapper.
    const dataTexEl =
      equation.closest(
        '*[data-math-source], *[data-tex], *[data-latex], *[data-math], *[data-equation], *[data-original], *[data-original-tex], *[data-source]'
      ) || equation;

    const dataTex =
      dataTexEl?.getAttribute("data-math-source") ||
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

    // Explicit source attributes beat aria-label: some hosts put spoken text
    // ("T sub O S") in aria-label rather than TeX.
    return dataTex || ariaTex || scriptTex || null;
  }

  handleLatexCopy(equation, delimiter) {
    const latex = this.getTexSource(equation);

    if (latex) {
      const formattedLatex = this.formatLatexForCopy(latex, delimiter);

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
        const formattedLatex = this.formatLatexForCopy(recoveredTex, delimiter);
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

  formatLatexForCopy(latex, delimiter) {
    const source = latex
      .trim()
      .replace(/^\$\$([\s\S]*)\$\$$/, "$1")
      .replace(/^\\\[([\s\S]*)\\\]$/, "$1")
      .replace(/^\$([\s\S]*)\$$/, "$1")
      .trim()
      .replace(/\s*\n\s*/g, " ")
      .replace(/\\frac\s*(\d)\s*(\d)/g, "\\frac{$1}{$2}");

    if (delimiter === "brackets") return `\\[${source}\\]`;
    if (delimiter === "doubledollar") return `$$${source}$$`;
    return `$${source}$`;
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
      // KaTeX draws radicals and stretchy delimiters with SVG, where className
      // is an SVGAnimatedString rather than a string.
      const cls = el.getAttribute("class") || "";
      if (structuralPattern.test(cls)) {
        return Array.from(el.childNodes).map(harvest).join("");
      }
      if (cls.includes("msupsub")) {
        // KaTeX stacks scripts in a vlist. `top` is negative and more negative
        // means higher on the page, so the topmost row is the superscript and
        // the bottom row is the subscript. With a single row, KaTeX only emits
        // the extra `vlist-t2` baseline row when the script hangs below the
        // baseline, i.e. when it is a subscript.
        const rows = Array.from(el.querySelectorAll(".vlist > span"))
          .filter((s) => s.style.top)
          .map((s) => ({ top: parseFloat(s.style.top), text: harvest(s).trim() }))
          .filter((r) => r.text && !Number.isNaN(r.top))
          .sort((a, b) => a.top - b.top);

        if (!rows.length) return "";
        if (rows.length === 1) {
          const isSub = !!el.querySelector(".vlist-t2");
          return `${isSub ? "_" : "^"}{${rows[0].text}}`;
        }
        return `_{${rows[rows.length - 1].text}}^{${rows[0].text}}`;
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

  // Locates the <math> element for a rendered equation. Providers nest it
  // differently, so check the node itself, its KaTeX container, then siblings.
  findMathElement(equation) {
    if (equation.tagName && equation.tagName.toLowerCase() === "math") {
      return equation;
    }
    const container = equation.closest(".katex, .katex-display");
    const inside =
      equation.querySelector("math") ||
      container?.querySelector("math") ||
      equation.querySelector(".katex-mathml")?.querySelector("math") ||
      container?.querySelector(".katex-mathml")?.querySelector("math");
    if (inside) return inside;

    // Last resort: a sibling <math>. Only trust it when the parent holds
    // exactly one, otherwise a neighbouring equation would be copied instead.
    const siblings = equation.parentElement?.querySelectorAll("math");
    return siblings && siblings.length === 1 ? siblings[0] : null;
  }

  optimizeFencedMrows(xmlDoc) {
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
        // This is a fenced mrow.
        // 1. Replace comma operators <mo>,</mo> with <mtext>, </mtext> so
        //    Word puts a space after the separator.
        // 2. Remove empty <mtext>
        //
        // Identifiers are deliberately left as <mi>: rewriting them to
        // <mtext> makes Word render variables upright, so "f(x, y)" comes
        // out in body text style instead of math italic.
        const newChildren = [];

        elementChildren.forEach((child) => {
          if (child.nodeName === "mo" && child.textContent.trim() === ",") {
            const mtext = xmlDoc.createElementNS(mathNS, "mtext");
            // NBSP, not a plain space: Word collapses a trailing ordinary
            // space in <mtext> and the separator loses its gap.
            mtext.textContent = ",\u00a0";
            newChildren.push(mtext);
          } else if (child.nodeName === "mtext") {
            if (child.textContent.trim().length > 0) {
              newChildren.push(child);
            }
          } else {
            newChildren.push(child);
          }
        });

        while (mrow.firstChild) {
          mrow.removeChild(mrow.firstChild);
        }
        newChildren.forEach((child) => mrow.appendChild(child));
      }
    });
  }

  addInvisibleTimes(xmlDoc) {
    const mathNS = "http://www.w3.org/1998/Math/MathML";
    const scripted = new Set([
      "msub", "msup", "msubsup", "mover", "munder", "munderover",
    ]);
    const fixedArity = new Set([
      ...scripted, "mfrac", "mroot",
    ]);
    const isFactor = (node) => {
      if (node.nodeName === "mi" || node.nodeName === "mn") return true;
      if (["mfrac", "msqrt", "mroot", "mtable"].includes(node.nodeName)) return true;
      if (
        node.nodeName === "mrow" &&
        Array.from(node.children).some((child) => child.nodeName === "mtable")
      ) return true;
      if (!scripted.has(node.nodeName)) return false;
      const base = Array.from(node.childNodes).find(
        (child) => child.nodeType === Node.ELEMENT_NODE
      );
      return base ? isFactor(base) : false;
    };

    Array.from(xmlDoc.getElementsByTagName("mrow")).forEach((mrow) => {
      if (fixedArity.has(mrow.parentNode?.nodeName)) return;
      const children = Array.from(mrow.childNodes).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE
      );

      for (let i = 1; i < children.length; i++) {
        const left = children[i - 1];
        const right = children[i];
        if (!isFactor(left) || !isFactor(right)) continue;
        if (
          left.nodeName === "mi" && right.nodeName === "mi" &&
          left.getAttribute("mathvariant") === "normal" &&
          right.getAttribute("mathvariant") === "normal"
        ) continue;
        const times = xmlDoc.createElementNS(mathNS, "mo");
        times.textContent = "\u2062";
        mrow.insertBefore(times, right);
      }
    });
  }

  groupDelimitedComponents(xmlDoc) {
    const mathNS = "http://www.w3.org/1998/Math/MathML";
    const opening = "([{";
    const closing = ")]}";
    const rows = Array.from(xmlDoc.getElementsByTagName("mrow"));

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const mrow = rows[rowIndex];
      const children = Array.from(mrow.childNodes).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE
      );
      let depth = 0;
      let start = 0;
      let sawComma = false;
      const groupUntil = (end) => {
        const component = children.slice(start, end);
        if (component.length > 1) {
          const group = xmlDoc.createElementNS(mathNS, "mrow");
          mrow.insertBefore(group, component[0]);
          component.forEach((child) => group.appendChild(child));
          rows.push(group);
        }
        start = end + 1;
      };

      children.forEach((child, index) => {
        const value = child.textContent.trim();
        if (child.nodeName === "mo" && opening.includes(value)) {
          if (depth++ === 0) {
            start = index + 1;
            sawComma = false;
          }
        } else if (child.nodeName === "mo" && closing.includes(value)) {
          if (depth === 1 && sawComma) groupUntil(index);
          if (depth > 0) depth--;
        } else if (
          depth === 1 &&
          ((child.nodeName === "mo" && value === ",") ||
            (child.nodeName === "mtext" && value.startsWith(",")))
        ) {
          sawComma = true;
          groupUntil(index);
        }
      });
    }
  }

  flattenTaggedEquationTables(xmlDoc) {
    const mathNS = "http://www.w3.org/1998/Math/MathML";

    Array.from(xmlDoc.getElementsByTagName("mtable")).forEach((table) => {
      if (table.getAttribute("width") !== "100%") return;
      const rows = Array.from(table.children).filter((child) => child.nodeName === "mtr");
      const cells = rows.length === 1
        ? Array.from(rows[0].children).filter((child) => child.nodeName === "mtd")
        : [];
      if (
        cells.length !== 4 ||
        cells[0].textContent.trim() ||
        cells[2].textContent.trim()
      ) return;

      const equation = cells[1].firstElementChild;
      const tag = cells[3].firstElementChild;
      if (!equation || tag?.nodeName !== "mtext" || !tag.textContent.trim()) return;

      const flat = xmlDoc.createElementNS(mathNS, "mrow");
      flat.appendChild(equation);
      tag.textContent = "#" + tag.textContent.trim();
      flat.appendChild(tag);
      table.parentNode?.replaceChild(flat, table);
    });
  }

  normalizeVerticalBars(xmlDoc) {
    const mathNS = "http://www.w3.org/1998/Math/MathML";

    Array.from(xmlDoc.getElementsByTagName("mi")).forEach((identifier) => {
      if (
        identifier.getAttribute("mathvariant") !== "normal" ||
        !["|", "∣"].includes(identifier.textContent.trim())
      ) return;
      const operator = xmlDoc.createElementNS(mathNS, "mo");
      operator.setAttribute("stretchy", "false");
      operator.textContent = identifier.textContent;
      identifier.parentNode?.replaceChild(operator, identifier);
    });
  }

  // Turns one rendered equation into Word-ready MathML, or null if the source
  // cannot be resolved. Every copy path goes through here.
  buildMathMLFor(equation) {
    const mathElement = this.findMathElement(equation);
    let mathMLString;

    if (mathElement) {
      mathMLString = new XMLSerializer()
        .serializeToString(mathElement)
        .replaceAll("&nbsp;", " ");
    } else {
      let tex = this.getTexSource(equation);
      if (!tex) {
        try {
          tex = this.extractTexFromKatexHtml(equation);
        } catch (e) {
          console.error("katex-html TeX heuristic failed:", e);
        }
      }
      if (!tex || typeof katex === "undefined" || !katex.renderToString) {
        console.warn("No MathML or TeX could be resolved for KaTeX node.");
        return null;
      }
      try {
        mathMLString = this.stripKatexSpan(
          katex
            .renderToString(tex, {
              output: "mathml",
              displayMode: !!equation.closest(".katex-display"),
            })
            .replaceAll("&nbsp;", " ")
        );
      } catch (e) {
        console.error("KaTeX renderToString failed:", e);
        return null;
      }
    }

    const xmlDoc = new DOMParser().parseFromString(
      mathMLString,
      "application/xml"
    );
    if (xmlDoc.getElementsByTagName("parsererror").length) {
      console.error("MathML did not parse as XML");
      return null;
    }
    this.flattenTaggedEquationTables(xmlDoc);
    this.normalizeVerticalBars(xmlDoc);
    this.optimizeFencedMrows(xmlDoc);
    this.addInvisibleTimes(xmlDoc);
    this.groupDelimitedComponents(xmlDoc);
    return this.sanitizeMathMLForWord(
      new XMLSerializer().serializeToString(xmlDoc)
    );
  }

  handleMathmlCopy(equation) {
    const mathMLString = this.buildMathMLFor(equation);
    if (!mathMLString) return;

    this.copyToClipboard(mathMLString)
      .then(() => {
        this.updateStats();
        this.showCopyFeedback(equation);
      })
      .catch((err) => console.error("Failed to copy equation:", err));
  }

  // --- Whole-message copy ---------------------------------------------------

  // Adds one "Copy for Word" button per assistant reply that contains math.
  addMessageCopyButtons() {
    const matches = [];
    MESSAGE_CONTAINERS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!matches.includes(el)) matches.push(el);
      });
    });

    // Several selectors can match the same reply at different depths. Keep the
    // outermost so the button appears once and the copy covers the full text.
    const roots = matches.filter(
      (el) => !matches.some((other) => other !== el && other.contains(el))
    );

    roots.forEach((root) => {
      if (root.dataset.kgptMessage) return;
      if (!root.querySelector(".katex")) return;

      root.dataset.kgptMessage = "1";
      root.classList.add("kgpt-message");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kgpt-copy-message";
      btn.textContent = "Copy for Word";
      btn.addEventListener(
        "click",
        (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          this.handleMessageCopy(root, btn);
        },
        true
      );
      root.appendChild(btn);
    });
  }

  handleMessageCopy(root, btn) {
    const html = this.buildMessageHtml(root);
    const text = this.buildMessagePlainText(root);

    this.copyRich(html, text)
      .then(() => {
        this.updateStats();
        if (btn) {
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy for Word"), 1500);
        }
      })
      .catch((err) => console.error("Failed to copy message:", err));
  }

  // Strips interface chrome that would otherwise paste as stray text.
  cleanMessageClone(clone) {
    clone
      .querySelectorAll(
        "button, svg, .sr-only, .kgpt-copy-message, .kgpt-feedback"
      )
      .forEach((el) => el.remove());
  }

  // Word eats an ordinary space that sits directly against an equation, so the
  // space touching inline math has to be a non-breaking one. Providers wrap
  // equations in spans of their own, so neighbours are found in document order
  // rather than as direct siblings.
  padInlineMathBoundaries(clone) {
    const walker = document.createTreeWalker(
      clone,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) =>
          node.nodeType === Node.TEXT_NODE ||
          node.nodeName.toLowerCase() === "math"
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP,
      }
    );

    const flow = [];
    while (walker.nextNode()) flow.push(walker.currentNode);

    flow.forEach((node, i) => {
      if (node.nodeName.toLowerCase() !== "math") return;
      if (node.getAttribute("display") === "block") return;

      const prev = flow[i - 1];
      if (prev?.nodeType === Node.TEXT_NODE && /\s$/.test(prev.nodeValue)) {
        prev.nodeValue = prev.nodeValue.replace(/\s+$/, "\u00a0");
      }
      const next = flow[i + 1];
      if (next?.nodeType === Node.TEXT_NODE && /^\s/.test(next.nodeValue)) {
        next.nodeValue = next.nodeValue.replace(/^\s+/, "\u00a0");
      }
    });
  }

  // Builds the text/html flavour: the reply's markup with every rendered
  // equation swapped for the MathML that Word understands.
  buildMessageHtml(root) {
    const live = Array.from(root.querySelectorAll(".katex"));
    const clone = root.cloneNode(true);
    const cloned = Array.from(clone.querySelectorAll(".katex"));

    live.forEach((equation, i) => {
      const target = cloned[i];
      if (!target) return;

      const displayWrap = target.closest(".katex-display");
      let replaced = displayWrap || target;
      const mathML = this.buildMathMLFor(equation);

      // Providers wrap a display equation in inline spans of their own. A block
      // nested inside an inline element makes Word split the paragraph and emit
      // a stray blank line, so climb out of wrappers that hold nothing else.
      if (displayWrap) {
        const holdsOnly = (el) => {
          const parent = el.parentElement;
          if (!parent || parent === clone) return false;
          return Array.from(parent.childNodes).every(
            (n) =>
              n === el ||
              (n.nodeType === Node.TEXT_NODE && !n.nodeValue.trim())
          );
        };
        while (holdsOnly(replaced)) replaced = replaced.parentElement;
      }

      if (!mathML) {
        replaced.remove();
        return;
      }

      // A div, not a p: the equation often already sits inside a paragraph and
      // nesting p inside p makes Word drop the block.
      const holder = document.createElement(displayWrap ? "div" : "span");
      if (displayWrap) holder.setAttribute("style", "text-align:center");
      holder.innerHTML = mathML;
      replaced.replaceWith(holder);

      // Whitespace left either side of a block equation becomes an empty
      // paragraph in Word, which shows up as a stray blank line.
      if (displayWrap) {
        [holder.previousSibling, holder.nextSibling].forEach((sib) => {
          if (sib?.nodeType === Node.TEXT_NODE && !sib.nodeValue.trim()) {
            sib.remove();
          }
        });
      }
    });

    this.padInlineMathBoundaries(clone);
    this.cleanMessageClone(clone);
    return clone.innerHTML;
  }

  // Plain-text flavour, for editors that ignore text/html. Equations fall back
  // to their LaTeX source.
  buildMessagePlainText(root) {
    const live = Array.from(root.querySelectorAll(".katex"));
    const clone = root.cloneNode(true);
    const cloned = Array.from(clone.querySelectorAll(".katex"));

    live.forEach((equation, i) => {
      const target = cloned[i];
      if (!target) return;
      const displayWrap = target.closest(".katex-display");
      const tex = this.getTexSource(equation);
      const rendered = tex
        ? displayWrap
          ? `\n$$${tex}$$\n`
          : `$${tex}$`
        : target.textContent;
      (displayWrap || target).replaceWith(document.createTextNode(rendered));
    });

    this.cleanMessageClone(clone);

    const BLOCK =
      /^(P|DIV|LI|UL|OL|H1|H2|H3|H4|H5|H6|PRE|TABLE|TR|BLOCKQUOTE|BR)$/;
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const inner = Array.from(node.childNodes).map(walk).join("");
      return BLOCK.test(node.tagName) ? `${inner}\n` : inner;
    };

    return walk(clone).replace(/\n{3,}/g, "\n\n").trim();
  }

  // Writes both flavours so Word gets rich content and plain editors get text.
  copyRich(html, text) {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      });
      return navigator.clipboard
        .write([item])
        .catch(() => this.copyRichFallback(html));
    }
    return this.copyRichFallback(html);
  }

  // execCommand path for when the async clipboard is unavailable or rejects
  // because the document is not focused.
  copyRichFallback(html) {
    const holder = document.createElement("div");
    holder.setAttribute("contenteditable", "true");
    holder.style.cssText = "position:fixed;left:-9999px;top:0;";
    holder.innerHTML = html;
    document.body.appendChild(holder);

    const range = document.createRange();
    range.selectNodeContents(holder);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    selection.removeAllRanges();
    holder.remove();

    return ok
      ? Promise.resolve()
      : Promise.reject(new Error("rich copy failed"));
  }

  showCopyFeedback(equation) {
    // Add a brief visual feedback when copying
    equation.style.transition = "transform 0.2s ease";
    equation.style.transform = "scale(1.05)";

    // Create and show a temporary "Copied!" message
    const feedback = document.createElement("div");
    feedback.className = "kgpt-feedback";
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
