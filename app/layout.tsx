import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RafikiSMS API Documentation',
  description: 'Complete API reference for the RafikiSMS platform - send SMS, OTP, manage sender names, and more.',
  icons: {
    icon: [
      { url: '/rafiki.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply theme class before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((s||p)==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body className="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider>
          <div className="min-h-screen">
            <Sidebar />
            <main className="lg:pl-72 pt-14 lg:pt-0 min-h-screen">
              <div className="w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
