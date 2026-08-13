// Checks the MathML the extension puts on the clipboard is well-formed enough
// for Word: correct arity on script/fraction elements, no leftover KaTeX
// annotation cruft, no invisible control operators, single <math> root.
//
// Run:  node test/collector.js  (then load test/harness.html and POST results)
//       node test/validate.js
const results = require("./results.json");

const ARITY = {
  msub: 2, msup: 2, mfrac: 2, mroot: 2, munder: 2, mover: 2,
  msubsup: 3, munderover: 3,
};
const INVISIBLE = /[⁡⁢⁣⁤]/;

function scan(xml) {
  const problems = [];
  const re = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  const stack = [];
  let m;
  while ((m = re.exec(xml))) {
    const [, close, tag, , self] = m;
    if (close) {
      const n = stack.pop();
      if (n && ARITY[n.tag] && n.kids !== ARITY[n.tag]) {
        problems.push(`<${n.tag}> has ${n.kids} children, needs ${ARITY[n.tag]}`);
      }
    } else {
      if (stack.length) stack[stack.length - 1].kids++;
      if (!self) stack.push({ tag, kids: 0 });
    }
  }
  if (/<(semantics|annotation)/.test(xml)) problems.push("leftover <semantics>/<annotation>");
  if (INVISIBLE.test(xml)) problems.push("invisible control operator present");
  if ((xml.match(/<math[\s>]/g) || []).length !== 1) problems.push("not exactly one <math> root");
  if (!/^<math[\s>]/.test(xml.trim())) problems.push("does not start at <math> (wrapper leaked)");
  // Non-breaking spaces are required, not a defect: Word collapses ordinary
  // leading/trailing spaces inside <mtext>, so NBSP is what preserves them.
  if (/<mtext> | <\/mtext>/.test(xml)) problems.push("plain space at <mtext> edge (Word collapses it)");
  return [...new Set(problems)];
}

let failed = 0;
let checked = 0;
for (const shape of Object.keys(results)) {
  const rows = [];
  for (const c of results[shape]) {
    if (c.error) { rows.push(`  ${c.name.padEnd(11)} ERROR ${c.error}`); failed++; continue; }
    if (!c.out) {
      // The "bare" shape has no MathML and no TeX source at all, so the
      // last-resort HTML heuristic legitimately cannot recover every construct.
      const tolerated = shape === "bare";
      rows.push(`  ${c.name.padEnd(11)} ${tolerated ? "skip (no source recoverable)" : "NO OUTPUT"}`);
      if (!tolerated) failed++;
      continue;
    }
    checked++;
    const p = scan(c.out);
    if (p.length) { rows.push(`  ${c.name.padEnd(11)} FAIL ${p.join("; ")}`); failed++; }
  }
  const bad = rows.filter((r) => /FAIL|ERROR|NO OUTPUT/.test(r));
  console.log(`=== ${shape} === ${bad.length ? bad.length + " problem(s)" : "all clean"}`);
  rows.filter((r) => !/^\s+\S+\s+skip/.test(r) || true).forEach((r) => {
    if (/FAIL|ERROR|NO OUTPUT|skip/.test(r)) console.log(r);
  });
}

console.log(`\nchecked ${checked} MathML outputs, ${failed} problem(s)`);
process.exit(failed ? 1 : 0);
