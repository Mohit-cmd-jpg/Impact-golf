import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IMPACT GOLF - Elegance in Giving",
  description: "Golf Charity Subscription Platform - Elegance in Giving",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e0e0e" />
      </head>
      <body className="bg-surface text-on-surface antialiased font-body pb-20 md:pb-0">
        {children}
        <MobileNavigation />
      </body>
    </html>
  );
}

function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#262626]/60 backdrop-blur-xl border-t border-outline-variant rounded-t-[2rem] md:hidden px-6 py-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <a href="/" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary-container transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="text-[10px] font-medium">Home</span>
      </a>
      <a href="/draws" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary-container transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/></svg>
        <span className="text-[10px] font-medium">Draws</span>
      </a>
      <a href="/charities" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary-container transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        <span className="text-[10px] font-medium">Impact</span>
      </a>
      <a href="/dashboard" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary-container transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        <span className="text-[10px] font-medium">Wallet</span>
      </a>
      <a href="/dashboard" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary-container transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span className="text-[10px] font-medium">Profile</span>
      </a>
    </nav>
  );
}
