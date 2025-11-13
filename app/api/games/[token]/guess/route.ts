import { NextResponse } from 'next/server';
import { decryptGameToken } from '@/lib/game-token';
import { scoreGuess } from '@/lib/game';
import { isAllowedWord } from '@/lib/word-list';
import type { GuessRequest, GuessResponse, ApiErrorResponse } from '@/types';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;

  let secret: string;
  try {
    secret = decryptGameToken(token);
  } catch {
    const err: ApiErrorResponse = { error: 'Game not found' };
    return NextResponse.json(err, { status: 404 });
  }

  let body: GuessRequest;
  try {
    body = (await request.json()) as GuessRequest;
  } catch {
    const err: ApiErrorResponse = { error: 'Invalid JSON body' };
    return NextResponse.json(err, { status: 400 });
  }

  const guess = (body.guess ?? '').trim().toUpperCase();
  if (!isAllowedWord(guess)) {
    const err: ApiErrorResponse = {
      error: 'Guess must be a valid 5-letter word',
    };
    return NextResponse.json(err, { status: 400 });
  }

  const { pattern, isWin } = scoreGuess(secret, guess);
  const res: GuessResponse = { pattern, isWin };

  return NextResponse.json(res, { status: 200 });
}
