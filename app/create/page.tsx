'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ApiErrorResponse, CreateGameResponse } from '@/types';

export default function CreateGamePage() {
  const router = useRouter();
  const [word, setWord] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = word.trim().toUpperCase();
    if (!/^[A-Z]{5}$/.test(normalized)) {
      setError('Please enter a valid 5-letter word.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        body: JSON.stringify({ word: normalized }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = (await res.json()) as ApiErrorResponse;
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      const data = (await res.json()) as CreateGameResponse;
      router.push(`/share/${data.token}`);
    } catch {
      setError('Network error.');
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-xs md:max-w-sm flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-xl font-semibold uppercase tracking-wide">
          Create a Game
        </h2>
        <p className="text-center text-white/60">
          Enter a secret 5-letter word for your friend to guess.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          maxLength={5}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full rounded-md border border-muted px-3 py-2 text-center text-2xl uppercase tracking-[0.3em] outline-none"
        />

        {error && <p className="text-red-400 text-center text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-auto min-w-40 self-center mt-4 rounded-full bg-success px-6 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-[#6aaa64] disabled:opacity-50"
        >
          Create
        </button>
      </form>
    </div>
  );
}
