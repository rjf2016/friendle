import type { LetterResult } from '@/lib/game';

export interface ApiErrorResponse {
  error: string;
}

export interface CreateGameRequest {
  word: string;
}

export interface CreateGameResponse {
  token: string;
}

export interface GuessRequest {
  guess: string;
}

export interface GuessResponse {
  pattern: LetterResult[];
  isWin: boolean;
}

export interface GetGameResponse {
  exists: boolean;
}

export interface BoardRow {
  letters: string;
  pattern: LetterResult[] | null;
}

export type KeyboardStatus = 'correct' | 'present' | 'absent' | 'unknown';
