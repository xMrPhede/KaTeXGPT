# Word paste tests

The extension's job is to put MathML on the clipboard that Microsoft Word turns
into a correct equation, so the tests run the real `content.js` pipeline and
then check the result both structurally and inside Word itself.

## Provider DOM shapes

Providers expose the source equation in three different ways, and the harness
reproduces all three:

| shape     | what the page offers                          | providers                          |
|-----------|-----------------------------------------------|------------------------------------|
| `chatgpt` | KaTeX `output:"html"`, TeX in an attribute    | ChatGPT (`data-math-source`), Gemini (`data-math`) |
| `mathml`  | full KaTeX MathML + `<annotation>`            | Claude                             |
| `bare`    | KaTeX HTML only, no TeX anywhere              | worst case fallback                |

`bare` exercises the last-resort `extractTexFromKatexHtml` heuristic. It cannot
recover every construct (`\begin{cases}` has no HTML-only representation), so
`validate.js` tolerates missing output for that shape only.

## Structural check

```bash
node test/collector.js                      # serves the repo on :8732
# open http://localhost:8732/test/harness.html, then in the console:
#   for (const s of ['chatgpt','mathml','bare']) (window.__all ??= {})[s] = runAll(s);
#   await fetch('/collect', {method:'POST', body: JSON.stringify(window.__all)})
node test/validate.js                       # exits non-zero on any problem
```

`validate.js` asserts what Word actually needs, each rule established by pasting
the same equation into Word both ways:

- script/fraction elements have the right number of children
- no `<semantics>`/`<annotation>` left over
- invisible-times operators appear only inside `<mrow>`; other invisible controls
  are removed (inside `<msub>` they would break arity and can print boxes)
- exactly one `<math>` root, no wrapper `<span>` leaking in
- no plain space at an `<mtext>` edge (Word collapses it; NBSP survives)

## Whole-message copy

`runMessage(shape)` in the harness builds a realistic assistant reply (heading,
prose with inline math, display equations, a bullet list, bold text, and a stray
provider button) and runs `buildMessageHtml` / `buildMessagePlainText` over it.

Mixed text and equations cannot travel as plain text — Word turns a clipboard
that is entirely MathML into one equation. The message copy therefore writes the
`text/html` flavour with `<math>` embedded, plus a `text/plain` LaTeX fallback.

Things this path has to get right, each verified in Word:

- a space touching inline math must be NBSP, or Word deletes it
- a display equation must not stay nested inside the provider's inline span, or
  Word splits the paragraph and leaves a blank line
- provider chrome (buttons, icons, screen-reader text) must be stripped

```bash
./test/word-paste-html.sh <html-file> <out.pdf>   # pastes a text/html payload
```

## Word check

```bash
./test/word-paste.sh chatgpt        # pastes every case into a new Word document
./test/word-variants.sh out.pdf     # pastes hand-written A/B variants from variants.tsv
```

Export the document to PDF and read it back to compare renderings. `word-paste.sh`
drives Word through its own AppleScript dictionary (`paste object selection`),
so it needs no Accessibility permission, but Word must be installed.
