const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'admin'),
  path.join(__dirname, 'components', 'admin')
];

const replacements = [
  { pattern: /shadow-slate-200\/(50|40)(?![\s\w:-]*dark:)/g, replacement: "shadow-slate-200/$1 dark:shadow-none" },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

let modifiedFiles = 0;

dirs.forEach(dir => {
  const files = walk(dir);
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
    }
  });
});

console.log(`Modified ${modifiedFiles} files to support dark mode shadows.`);
