import React from 'react';
import type { KeyboardStatus } from '@/types';
import { cn } from '@/lib/utils';

interface KeyboardProps {
  keyboardMap: Record<string, KeyboardStatus>;
  onKey: (key: string) => void;
}

const KEYBOARD_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

const statusClassMap: Record<KeyboardStatus, string> = {
  unknown: 'bg-secondary',
  correct: 'bg-success',
  present: 'bg-warning',
  absent: 'bg-muted',
};

export default function Keyboard({ keyboardMap, onKey }: KeyboardProps) {
  return (
    <div className="mb-2 flex w-full flex-col gap-1.5">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {rowIndex === 2 && (
            <Key label="ENTER" wide onClick={() => onKey('ENTER')} />
          )}

          {row.split('').map((key) => {
            const status = keyboardMap[key] ?? 'unknown';
            const colorClass = statusClassMap[status];

            return (
              <Key
                key={key}
                label={key}
                onClick={() => onKey(key)}
                className={colorClass}
              />
            );
          })}

          {rowIndex === 2 && (
            <Key
              label={
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  fill="currentColor"
                >
                  <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
                </svg>
              }
              wide
              onClick={() => onKey('BACKSPACE')}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface KeyProps {
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  wide?: boolean;
}

function Key({ label, onClick, className, wide }: KeyProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[54px] items-center justify-center rounded-sm text-lg font-extrabold text-[#F8F8F8] transition-transform active:scale-95 select-none cursor-pointer',
        wide ? 'min-w-12 text-xs font-semibold' : 'min-w-[34px]',
        className ?? 'bg-secondary'
      )}
    >
      {label}
    </button>
  );
}
