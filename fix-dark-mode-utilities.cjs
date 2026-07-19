const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'admin'),
  path.join(__dirname, 'components', 'admin')
];

const replacements = [
  // Borders
  { pattern: /border-slate-200(?!\s+dark:border-)/g, replacement: "border-slate-200 dark:border-slate-800" },
  { pattern: /border-slate-100(?!\s+dark:border-)/g, replacement: "border-slate-100 dark:border-slate-800" },
  
  // Backgrounds
  { pattern: /bg-slate-50\/50(?!\s+dark:bg-)/g, replacement: "bg-slate-50/50 dark:bg-slate-800/50" },
  { pattern: /bg-slate-50(?!\/|\s+dark:bg-)/g, replacement: "bg-slate-50 dark:bg-slate-900/50" },
  { pattern: /bg-white(?!\s+dark:bg-)/g, replacement: "bg-white dark:bg-slate-900" },
  
  // Divides
  { pattern: /divide-slate-100(?!\s+dark:divide-)/g, replacement: "divide-slate-100 dark:divide-slate-800/50" },
  
  // Text
  { pattern: /text-slate-500(?!\s+dark:text-)/g, replacement: "text-slate-500 dark:text-slate-400" },
  { pattern: /text-slate-600(?!\s+dark:text-)/g, replacement: "text-slate-600 dark:text-slate-300" },
  { pattern: /text-slate-700(?!\s+dark:text-)/g, replacement: "text-slate-700 dark:text-slate-200" },
  { pattern: /text-slate-800(?!\s+dark:text-)/g, replacement: "text-slate-800 dark:text-slate-100" },
  { pattern: /text-slate-900(?!\s+dark:text-)/g, replacement: "text-slate-900 dark:text-slate-50" },
  
  // Hover Backgrounds
  { pattern: /hover:bg-slate-50(?!\/|\s+dark:hover:bg-)/g, replacement: "hover:bg-slate-50 dark:hover:bg-slate-800/50" },
  { pattern: /hover:bg-slate-50\/50(?!\s+dark:hover:bg-)/g, replacement: "hover:bg-slate-50/50 dark:hover:bg-slate-800/50" }
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

console.log(`Modified ${modifiedFiles} files to fix dark mode utilities.`);
