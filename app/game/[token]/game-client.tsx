'use client';

import { useCallback, useEffect, useState } from 'react';
import { MAX_GUESSES, WORD_LENGTH } from '@/lib/game';
import type {
  ApiErrorResponse,
  BoardRow,
  GuessResponse,
  KeyboardStatus,
} from '@/types';
import Board from '@/components/game/board';
import Keyboard from '@/components/game/keyboard';

interface GameClientProps {
  token: string;
}

export default function GameClient({ token }: GameClientProps) {
  const [board, setBoard] = useState<BoardRow[]>(
    Array.from({ length: MAX_GUESSES }, () => ({ letters: '', pattern: null }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyboardMap, setKeyboardMap] = useState<
    Record<string, KeyboardStatus>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [gameError, setGameError] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [revealingRowIndex, setRevealingRowIndex] = useState<number | null>(
    null
  );
  const [shakingRowIndex, setShakingRowIndex] = useState<number | null>(null);
  const [poppingColIndex, setPoppingColIndex] = useState<number | null>(null);

  useEffect(() => {
    async function checkGame() {
      try {
        const res = await fetch(`/api/games/${token}`);
        if (!res.ok) {
          const data = (await res.json()) as ApiErrorResponse;
          setGameError(data.error || 'Game not found.');
        }
      } catch (err) {
        console.error(err);
        setGameError('Network error while loading game.');
      } finally {
        setIsLoading(false);
      }
    }

    void checkGame();
  }, [token]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  }, []);

  const triggerShake = useCallback((rowIndex: number) => {
    setShakingRowIndex(rowIndex);
    setTimeout(() => {
      setShakingRowIndex((current) => (current === rowIndex ? null : current));
    }, 500);
  }, []);

  const updateKeyboardMap = useCallback(
    (guess: string, pattern: GuessResponse['pattern']) => {
      setKeyboardMap((prev) => {
        const next: Record<string, KeyboardStatus> = { ...prev };

        const rank = (s: KeyboardStatus): number => {
          switch (s) {
            case 'correct':
              return 3;
            case 'present':
              return 2;
            case 'absent':
              return 1;
            case 'unknown':
            default:
              return 0;
          }
        };

        for (let i = 0; i < guess.length; i++) {
          const letter = guess[i];
          const result = pattern[i];

          const newStatus: KeyboardStatus =
            result === 'correct'
              ? 'correct'
              : result === 'present'
              ? 'present'
              : 'absent';

          const existing = next[letter] ?? 'unknown';
          if (rank(newStatus) > rank(existing)) {
            next[letter] = newStatus;
          }
        }

        return next;
      });
    },
    []
  );

  const submitGuess = useCallback(async () => {
    if (isGameOver || isLoading || !!gameError) return;

    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== WORD_LENGTH) {
      showToast('Not enough letters');
      triggerShake(currentRow);
      return;
    }

    try {
      const res = await fetch(`/api/games/${token}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess }),
      });

      if (!res.ok) {
        const data = (await res.json()) as ApiErrorResponse;
        showToast(data.error || 'Invalid guess');
        triggerShake(currentRow);
        return;
      }

      const data = (await res.json()) as GuessResponse;

      const newBoard: BoardRow[] = [...board];
      newBoard[currentRow] = {
        letters: guess,
        pattern: data.pattern,
      };
      setBoard(newBoard);

      updateKeyboardMap(guess, data.pattern);

      // trigger flip animation for this row
      setRevealingRowIndex(currentRow);
      setTimeout(() => {
        setRevealingRowIndex((current) =>
          current === currentRow ? null : current
        );
      }, WORD_LENGTH * 250 + 200);

      if (data.isWin) {
        setIsGameOver(true);
        showToast('You won!');
        return;
      }

      if (currentRow + 1 >= MAX_GUESSES) {
        setIsGameOver(true);
        showToast('Out of guesses!');
        return;
      }

      setCurrentRow((prev) => prev + 1);
      setCurrentGuess('');
      setPoppingColIndex(null);
    } catch (err) {
      console.error(err);
      showToast('Network error');
    }
  }, [
    board,
    currentGuess,
    currentRow,
    gameError,
    isGameOver,
    isLoading,
    showToast,
    token,
    triggerShake,
    updateKeyboardMap,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (isGameOver || isLoading || !!gameError) return;

      if (key === 'ENTER') {
        void submitGuess();
        return;
      }

      if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
        setPoppingColIndex(null);
        return;
      }

      if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => {
          const nextGuess = (prev + key).slice(0, WORD_LENGTH);
          const newLength = nextGuess.length;

          if (newLength > prev.length) {
            const colIndex = newLength - 1;
            setPoppingColIndex(colIndex);
            setTimeout(() => {
              setPoppingColIndex((current) =>
                current === colIndex ? null : current
              );
            }, 120);
          }

          return nextGuess;
        });
      }
    },
    [currentGuess.length, gameError, isGameOver, isLoading, submitGuess]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKey('BACKSPACE');
      } else {
        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter)) {
          e.preventDefault();
          handleKey(letter);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  if (gameError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-warning">{gameError}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center justify-between gap-6">
      <div className="mt-4 flex flex-col items-center gap-2">
        <Board
          board={board}
          currentRow={currentRow}
          currentGuess={currentGuess}
          revealingRowIndex={revealingRowIndex}
          shakingRowIndex={shakingRowIndex}
          poppingColIndex={poppingColIndex}
        />
      </div>

      <Keyboard keyboardMap={keyboardMap} onKey={handleKey} />

      {toast && (
        <div className="pointer-events-none fixed top-20 flex w-full justify-center">
          <div className="rounded-md bg-muted px-4 py-2 text-sm font-semibold text-foreground">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
