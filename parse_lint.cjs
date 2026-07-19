const fs = require('fs');
const lines = fs.readFileSync('lint_output.txt', 'utf8').split('\n');
const anyFiles = new Set();
let currentFile = '';
for (const line of lines) {
  if (line.match(/^[A-Z]:\\/i) || line.startsWith('/')) {
    currentFile = line.trim();
  }
  if (line.includes('@typescript-eslint/no-explicit-any')) {
    anyFiles.add(currentFile);
  }
}
console.log(Array.from(anyFiles).join('\n'));
