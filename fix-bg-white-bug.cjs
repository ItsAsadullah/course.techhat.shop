const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app', 'admin'),
  path.join(__dirname, 'components', 'admin')
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

    // Fix the bg-white regex bug
    content = content.replace(/bg-white dark:bg-slate-900\/(\d+)/g, "bg-white/$1 dark:bg-slate-900/$1");

    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedFiles++;
      console.log(`Fixed ${file}`);
    }
  });
});

console.log(`Modified ${modifiedFiles} files to fix the bg-white bug.`);
