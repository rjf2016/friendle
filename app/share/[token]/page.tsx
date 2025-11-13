'use client';

import { use } from 'react';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : '';

export default function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const url = BASE_URL ? `${BASE_URL}/game/${token}` : `/game/${token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex w-full max-w-xs md:max-w-sm flex-col items-center gap-6">
      <h2 className="text-xl font-semibold uppercase tracking-wide">
        Share This Link
      </h2>

      <p className="text-center text-gray-300">
        Send this link to a friend or post it anywhere. They&apos;ll get a
        Wordle-style puzzle with your secret word.
      </p>

      <input
        type="url"
        readOnly
        value={url}
        className="w-full rounded-md border border-muted text-white/80 bg-transparent px-3 py-2 text-sm text-center whitespace-nowrap overflow-x-auto cursor-pointer"
      />

      <button
        onClick={copy}
        className="rounded-full min-w-40 bg-success px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6aaa64]"
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
