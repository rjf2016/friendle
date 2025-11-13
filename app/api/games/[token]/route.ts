import { NextResponse } from 'next/server';
import { decryptGameToken } from '@/lib/game-token';
import type { GetGameResponse, ApiErrorResponse } from '@/types';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_req: Request, context: RouteContext) {
  const { token } = await context.params;

  try {
    decryptGameToken(token);
  } catch {
    const resError: ApiErrorResponse = { error: 'Game not found' };
    return NextResponse.json(resError, { status: 404 });
  }

  const res: GetGameResponse = { exists: true };
  return NextResponse.json(res, { status: 200 });
}
