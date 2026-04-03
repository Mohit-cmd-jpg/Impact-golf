import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'IMPACT GOLF — Play Your Game. Power Their Mission.',
    template: '%s | IMPACT GOLF',
  },
  description:
    'A premium subscription platform combining golf performance tracking, monthly prize draws, and charitable giving. Transform every Stableford point into real-world change.',
  keywords: ['golf', 'charity', 'subscription', 'stableford', 'prize draw', 'impact', 'monthly draw'],
  authors: [{ name: 'Impact Golf' }],
  openGraph: {
    title: 'IMPACT GOLF — Play Your Game. Power Their Mission.',
    description: 'Transform every Stableford point into real-world change.',
    type: 'website',
    siteName: 'IMPACT GOLF',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0e0e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased font-body selection:bg-primary-container selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
