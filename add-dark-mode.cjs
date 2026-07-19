const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'admin'),
  path.join(__dirname, 'components', 'admin')
];

const replacements = [
  // Backgrounds
  { pattern: /bg-white(?!\/)/g, replacement: "bg-white dark:bg-slate-900" },
  { pattern: /bg-slate-50(?!\/)/g, replacement: "bg-slate-50 dark:bg-slate-900/50" },
  { pattern: /bg-slate-100(?!\/)/g, replacement: "bg-slate-100 dark:bg-slate-800" },
  { pattern: /hover:bg-slate-50(?!\/)/g, replacement: "hover:bg-slate-50 dark:hover:bg-slate-800" },
  { pattern: /hover:bg-slate-100(?!\/)/g, replacement: "hover:bg-slate-100 dark:hover:bg-slate-700" },

  // Borders
  { pattern: /border-slate-100(?!\/)/g, replacement: "border-slate-100 dark:border-slate-800" },
  { pattern: /border-slate-200(?!\/)/g, replacement: "border-slate-200 dark:border-slate-700" },
  { pattern: /border-slate-300(?!\/)/g, replacement: "border-slate-300 dark:border-slate-600" },

  // Text
  { pattern: /text-slate-800(?!\/)/g, replacement: "text-slate-800 dark:text-slate-100" },
  { pattern: /text-slate-900(?!\/)/g, replacement: "text-slate-900 dark:text-slate-50" },
  { pattern: /text-slate-700(?!\/)/g, replacement: "text-slate-700 dark:text-slate-200" },
  { pattern: /text-slate-600(?!\/)/g, replacement: "text-slate-600 dark:text-slate-300" },
  { pattern: /text-slate-500(?!\/)/g, replacement: "text-slate-500 dark:text-slate-400" },
  
  // Custom fix for double replacements
  { pattern: /dark:bg-slate-900 dark:bg-slate-900/g, replacement: "dark:bg-slate-900" },
  { pattern: /dark:text-slate-100 dark:text-slate-100/g, replacement: "dark:text-slate-100" },
  { pattern: /dark:border-slate-800 dark:border-slate-800/g, replacement: "dark:border-slate-800" },
  { pattern: /dark:border-slate-700 dark:border-slate-700/g, replacement: "dark:border-slate-700" },
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
      // Lookbehind to prevent modifying already modified strings
      // Since Node.js supports lookbehinds, we can ensure we don't match if it's already followed by the dark variant
      const safePattern = new RegExp(pattern.source + `(?![\\s\\w:-]*dark:)`, 'g');
      content = content.replace(safePattern, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
    }
  });
});

console.log(`Modified ${modifiedFiles} files to support dark mode.`);
