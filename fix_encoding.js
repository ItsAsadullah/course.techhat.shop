const fs = require('fs');
const files = [
  'src/components/typing-master/keyboard/DrillSvgHands.tsx',
  'src/components/typing-master/typing/SoundManager.ts',
  'src/data/typing-master/englishCurriculum.ts'
];
files.forEach(f => {
  const orig = 'TypingMaster/' + f.replace('typing-master/', '');
  let content = fs.readFileSync(orig, 'utf8');
  content = content.replace(/\"@\/components\//g, '\"@/components/typing-master/');
  content = content.replace(/\"@\/lib\//g, '\"@/lib/typing-master/');
  content = content.replace(/\"@\/context\//g, '\"@/context/typing-master/');
  content = content.replace(/\"@\/hooks\//g, '\"@/hooks/typing-master/');
  content = content.replace(/\"@\/data\//g, '\"@/data/typing-master/');
  content = content.replace(/\"@\/types\//g, '\"@/types/typing-master/');
  content = content.replace(/\'@\/components\//g, '\'@/components/typing-master/');
  content = content.replace(/\'@\/lib\//g, '\'@/lib/typing-master/');
  content = content.replace(/\'@\/context\//g, '\'@/context/typing-master/');
  content = content.replace(/\'@\/hooks\//g, '\'@/hooks/typing-master/');
  content = content.replace(/\'@\/data\//g, '\'@/data/typing-master/');
  content = content.replace(/\'@\/types\//g, '\'@/types/typing-master/');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed ' + f);
});
