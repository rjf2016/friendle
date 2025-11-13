import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-1 max-w-sm flex-col items-center justify-center gap-6">
      <p className="text-center text-lg text-gray-200">
        Create a custom 5-letter word and challenge a friend to guess it,
        Wordle-style.
      </p>
      <Link
        href="/create"
        className="rounded-full text-center min-w-40 bg-success px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6aaa64]"
      >
        Create a game
      </Link>
    </div>
  );
}
