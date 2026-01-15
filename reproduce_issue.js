const { DOMParser, XMLSerializer } = require('xmldom');

const input = '<span class="katex"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow></math></span>';

function sanitizeMathMLForWord(mathMLString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(mathMLString, "application/xml");

    // Original logic does not strip root
    return new XMLSerializer().serializeToString(xmlDoc);
}

const output = sanitizeMathMLForWord(input);
console.log("Output:", output);

if (output.startsWith('<span')) {
    console.log("FAIL: Output still has span wrapper");
} else {
    console.log("SUCCESS: Output stripped span wrapper");
}
