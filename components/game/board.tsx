import { WORD_LENGTH } from '@/lib/game';
import type { BoardRow } from '@/types';
import { cn } from '@/lib/utils';

interface BoardProps {
  board: BoardRow[];
  currentRow: number;
  currentGuess: string;
  revealingRowIndex: number | null;
  shakingRowIndex: number | null;
  poppingColIndex: number | null;
}

export default function Board({
  board,
  currentRow,
  currentGuess,
  revealingRowIndex,
  shakingRowIndex,
  poppingColIndex,
}: BoardProps) {
  return (
    <div className="grid grid-rows-6 gap-1">
      {board.map((row, rowIndex) => {
        const isCurrent = rowIndex === currentRow;
        const isRevealing = rowIndex === revealingRowIndex;
        const isShaking = rowIndex === shakingRowIndex;

        const letters = (isCurrent ? currentGuess : row.letters).padEnd(
          WORD_LENGTH,
          ' '
        );

        return (
          <div
            key={rowIndex}
            className={cn('grid grid-cols-5 gap-1', isShaking && 'row-shake')}
          >
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
              const ch = letters[colIndex] ?? ' ';
              const state = row.pattern?.[colIndex] ?? 'empty';
              const isFilled = ch !== ' ';

              const isPopping =
                isCurrent &&
                poppingColIndex === colIndex &&
                row.pattern === null;

              // Determine final colors for flip animation
              let finalBg: string | undefined;
              let finalBorder: string | undefined;

              if (state === 'correct') {
                finalBg = 'var(--success)';
                finalBorder = 'var(--success)';
              } else if (state === 'present') {
                finalBg = 'var(--warning)';
                finalBorder = 'var(--warning)';
              } else if (state === 'absent') {
                finalBg = 'var(--muted)';
                finalBorder = 'var(--muted)';
              }

              const tileClasses = cn(
                'tile flex h-14 w-14 items-center justify-center border-2 text-2xl font-extrabold uppercase',
                // when not revealing, use static state classes
                !isRevealing &&
                  state === 'empty' &&
                  !isFilled &&
                  'bg-background border-muted text-foreground',
                !isRevealing &&
                  state === 'empty' &&
                  isFilled &&
                  'bg-background border-secondary text-foreground',
                !isRevealing &&
                  state === 'correct' &&
                  'bg-success border-success text-foreground',
                !isRevealing &&
                  state === 'present' &&
                  'bg-warning border-warning text-foreground',
                !isRevealing &&
                  state === 'absent' &&
                  'bg-muted border-muted text-foreground',
                // when revealing, start with neutral styling and let the animation handle color
                isRevealing &&
                  'bg-background border-secondary text-foreground tile-reveal',
                isPopping && 'tile-pop'
              );

              const style =
                isRevealing && state !== 'empty'
                  ? {
                      animationDelay: `${colIndex * 150}ms`,
                      '--tile-bg-final': finalBg,
                      '--tile-border-final': finalBorder,
                    }
                  : undefined;

              return (
                <div key={colIndex} className={tileClasses} style={style}>
                  {ch === ' ' ? '' : ch}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
