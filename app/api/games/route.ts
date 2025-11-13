import { NextResponse } from 'next/server';
import { isAllowedWord } from '@/lib/word-list';
import { createGameToken } from '@/lib/game-token';
import type {
  CreateGameRequest,
  CreateGameResponse,
  ApiErrorResponse,
} from '@/types';

export async function POST(request: Request) {
  let body: CreateGameRequest;

  try {
    body = (await request.json()) as CreateGameRequest;
  } catch {
    const res: ApiErrorResponse = { error: 'Invalid JSON body' };
    return NextResponse.json(res, { status: 400 });
  }

  const rawWord = (body.word ?? '').trim().toUpperCase();

  if (!isAllowedWord(rawWord)) {
    const res: ApiErrorResponse = {
      error: 'Word must be a valid 5-letter word',
    };
    return NextResponse.json(res, { status: 400 });
  }

  const token = createGameToken(rawWord);

  const response: CreateGameResponse = { token };
  return NextResponse.json(response, { status: 201 });
}
