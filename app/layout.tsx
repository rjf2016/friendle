import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Friendle',
  description: 'Very original word guessing game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <div className="flex min-h-svh h-full flex-col items-center">
          <header className="flex h-16 w-full items-center justify-center border-b border-[#3a3a3c]">
            <h1 className="text-2xl font-bold tracking-widest uppercase">
              Friendle
            </h1>
          </header>
          <main className="flex w-full max-w-lg flex-1 flex-col justify-center items-center px-4 pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
