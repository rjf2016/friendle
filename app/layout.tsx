import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const roboto = Roboto({
  subsets: ['latin'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://friendle-three.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Friendle',
  description: 'Very original word guessing game',
  openGraph: {
    title: 'Friendle',
    description: 'A very original word guessing game',
    url: '/',
    siteName: 'Friendle',
    locale: 'en_US',
    type: 'website',

    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 628,
        alt: 'Friendle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Friendle',
    description: 'A very original word guessing game',
    images: ['/og.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        rel: 'android-chrome',
        url: '/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  },
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
            <Link href="/">
              <h1 className="text-2xl font-bold tracking-widest uppercase">
                Friendle
              </h1>
            </Link>
          </header>
          <main className="flex w-full max-w-lg flex-1 flex-col justify-center items-center px-4 pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
