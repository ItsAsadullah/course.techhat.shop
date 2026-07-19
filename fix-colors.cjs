const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'admin'),
  path.join(__dirname, 'components', 'admin')
];

const replacements = [
  // Fix duplicates caused by previous script
  { pattern: /dark:bg-slate-800\/50\s+dark:bg-slate-800\/50/g, replacement: "dark:bg-slate-800/50" },
  { pattern: /dark:hover:bg-slate-800\/50\s+dark:bg-slate-800\/50/g, replacement: "dark:hover:bg-slate-800/50" },
  { pattern: /dark:border-slate-800\s+dark:border-slate-800/g, replacement: "dark:border-slate-800" },
  { pattern: /dark:bg-slate-900\s+dark:bg-slate-900/g, replacement: "dark:bg-slate-900" },
  { pattern: /dark:bg-slate-900\/50\s+dark:bg-slate-900\/50/g, replacement: "dark:bg-slate-900/50" },
  
  // Amber
  { pattern: /border-amber-200(?!\s+dark:border-)/g, replacement: "border-amber-200 dark:border-amber-900/50" },
  { pattern: /bg-amber-50(?!\s+dark:bg-)/g, replacement: "bg-amber-50 dark:bg-amber-900/10" },
  { pattern: /bg-amber-100(?!\s+dark:bg-)/g, replacement: "bg-amber-100 dark:bg-amber-900/40" },
  { pattern: /text-amber-800(?!\s+dark:text-)/g, replacement: "text-amber-800 dark:text-amber-400" },
  { pattern: /text-amber-700(?!\s+dark:text-)/g, replacement: "text-amber-700 dark:text-amber-500" },
  { pattern: /text-amber-600(?!\s+dark:text-)/g, replacement: "text-amber-600 dark:text-amber-500" },

  // Emerald
  { pattern: /border-emerald-200(?!\s+dark:border-)/g, replacement: "border-emerald-200 dark:border-emerald-900/50" },
  { pattern: /bg-emerald-50(?!\s+dark:bg-)/g, replacement: "bg-emerald-50 dark:bg-emerald-900/10" },
  { pattern: /bg-emerald-100(?!\s+dark:bg-)/g, replacement: "bg-emerald-100 dark:bg-emerald-900/40" },
  { pattern: /text-emerald-800(?!\s+dark:text-)/g, replacement: "text-emerald-800 dark:text-emerald-400" },
  { pattern: /text-emerald-700(?!\s+dark:text-)/g, replacement: "text-emerald-700 dark:text-emerald-500" },
  { pattern: /text-emerald-600(?!\s+dark:text-)/g, replacement: "text-emerald-600 dark:text-emerald-500" },

  // Blue
  { pattern: /border-blue-200(?!\s+dark:border-)/g, replacement: "border-blue-200 dark:border-blue-900/50" },
  { pattern: /bg-blue-50(?!\s+dark:bg-)/g, replacement: "bg-blue-50 dark:bg-blue-900/20" },
  { pattern: /bg-blue-100(?!\s+dark:bg-)/g, replacement: "bg-blue-100 dark:bg-blue-900/40" },
  { pattern: /text-blue-800(?!\s+dark:text-)/g, replacement: "text-blue-800 dark:text-blue-400" },
  { pattern: /text-blue-700(?!\s+dark:text-)/g, replacement: "text-blue-700 dark:text-blue-500" },
  { pattern: /text-blue-600(?!\s+dark:text-)/g, replacement: "text-blue-600 dark:text-blue-400" },
  
  // Red/Rose
  { pattern: /border-red-200(?!\s+dark:border-)/g, replacement: "border-red-200 dark:border-red-900/50" },
  { pattern: /bg-red-50(?!\s+dark:bg-)/g, replacement: "bg-red-50 dark:bg-red-900/10" },
  { pattern: /bg-red-100(?!\s+dark:bg-)/g, replacement: "bg-red-100 dark:bg-red-900/40" },
  { pattern: /text-red-800(?!\s+dark:text-)/g, replacement: "text-red-800 dark:text-red-400" },
  { pattern: /text-red-700(?!\s+dark:text-)/g, replacement: "text-red-700 dark:text-red-500" },
  { pattern: /text-red-600(?!\s+dark:text-)/g, replacement: "text-red-600 dark:text-red-500" },
  { pattern: /text-red-900(?!\s+dark:text-)/g, replacement: "text-red-900 dark:text-red-300" },
  { pattern: /text-rose-500(?!\s+dark:text-)/g, replacement: "text-rose-500 dark:text-rose-400" }
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

console.log(`Modified ${modifiedFiles} files to fix colored dark mode utilities and duplicates.`);
