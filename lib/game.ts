export type LetterResult = 'correct' | 'present' | 'absent';

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

/**
 * Implements Wordle-style scoring rules including duplicate handling.
 */
export function scoreGuess(secret: string, guess: string) {
  if (secret.length !== WORD_LENGTH || guess.length !== WORD_LENGTH) {
    throw new Error('Invalid word length');
  }

  const pattern: LetterResult[] = new Array(WORD_LENGTH);
  const secretChars = secret.split('');
  const guessChars = guess.split('');

  const remaining: Record<string, number> = {};

  // First pass: correct matches
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === secretChars[i]) {
      pattern[i] = 'correct';
    } else {
      const ch = secretChars[i];
      remaining[ch] = (remaining[ch] ?? 0) + 1;
    }
  }

  // Second pass: present or absent
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (pattern[i] === 'correct') continue;

    const ch = guessChars[i];
    if (remaining[ch] && remaining[ch] > 0) {
      pattern[i] = 'present';
      remaining[ch] -= 1;
    } else {
      pattern[i] = 'absent';
    }
  }

  const isWin = pattern.every((p) => p === 'correct');
  return { pattern, isWin };
}
