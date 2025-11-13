import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
  const sourcePath = path.resolve(__dirname, '../data/words.txt');
  const destPath = path.resolve(__dirname, '../lib/word-list.ts');

  const raw = await fs.readFile(sourcePath, 'utf8');

  const words = raw
    .split(/\r?\n/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.toUpperCase())
    .filter((w) => /^[A-Z]{5}$/.test(w));

  const uniqueSorted = Array.from(new Set(words)).sort();

  const lines = [
    '// AUTO-GENERATED FILE. Do not edit directly.',
    '// Run: npm run build:wordlist',
    '',
    'export const ALLOWED_WORDS = [',
    ...uniqueSorted.map((w) => `  "${w}",`),
    '] as const;',
    '',
    'const allowedSet = new Set(ALLOWED_WORDS);',
    '',
    'export function isAllowedWord(word: string): boolean {',
    '  const normalized = word.trim().toUpperCase();',
    '  if (!/^[A-Z]{5}$/.test(normalized)) return false;',
    '  return allowedSet.has(normalized as (typeof ALLOWED_WORDS)[number]);',
    '}',
    '',
  ];

  await fs.writeFile(destPath, lines.join('\n'), 'utf8');

  console.log(
    `Generated wordlist with ${uniqueSorted.length} words at src/lib/wordlist.ts`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
