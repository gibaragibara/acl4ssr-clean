// sanitize.js
const fs = require('fs');

const input = 'ACL4SSR_Online_Full.yaml';
const output = 'ACL4SSR_Online_Full_clean.yaml';

const emojiRegex =
  /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2460}-\u{24FF}\u{FE00}-\u{FE0F}\u200D\u3030\u00A9\u00AE]/gu;

const allowedCharReg =
  /[0-9A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s\-\._:\/@(){}\[\],!?%&=+|<>]/;

const sanitizeLine = (line) => {
  const [, indent = '', content = ''] = line.match(/^(\s*)(.*)$/) || [];
  const cleaned = content
    .normalize('NFKC')
    .replace(emojiRegex, '')
    .split('')
    .filter((ch) => allowedCharReg.test(ch))
    .join('')
    .replace(/\s+/g, ' ')
    .trimEnd();
  return indent + cleaned;
};

const original = fs.readFileSync(input, 'utf8');
const sanitized = original
  .split('\n')
  .map(sanitizeLine)
  .join('\n')
  .replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(output, sanitized, 'utf8');
console.log(`已生成 ${output}`);