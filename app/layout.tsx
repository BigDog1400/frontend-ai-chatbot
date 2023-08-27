import { Metadata } from 'next';

import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Sidebar } from './_components/sidebar';
import ReactQueryProvider from '@/components/react-query';

export const metadata: Metadata = {
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`,
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: light)', color: 'white' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Toaster />

        <ReactQueryProvider>
          <Providers attribute='class' defaultTheme='system' enableSystem>
            <div className='flex flex-col min-h-screen'>
              {/* @ts-ignore */}
              <Header />
              <div className='flex'>
                <Sidebar />
                <main className='flex flex-row items-center justify-between px-4 w-full flex-1 bg-muted/50'>
                  {children}
                </main>
              </div>
            </div>
            <TailwindIndicator />
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
