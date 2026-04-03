import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e0e0e" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
