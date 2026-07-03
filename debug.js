const fs = require('fs');
const code = fs.readFileSync('embedded.js', 'utf8');
const qCode = code.substring(code.indexOf('var qs = [];'), code.indexOf('return qs;'));

const testCode = `
  function svg(x){return x;} 
  function L(a,b,c,d){return a+b+c+d;} 
  ${qCode.replace('var optionsSvg = optionsData.map', 'if(optionsData.length < 4) console.log("FAILED AT i=" + i + ", length=" + optionsData.length); var optionsSvg = optionsData.map')}
  console.log('Total valid questions:', qs.length);
`;

try {
  eval(testCode);
} catch(e) {
  console.error('RUNTIME ERROR:', e.message);
}
