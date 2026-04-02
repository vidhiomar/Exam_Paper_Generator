'use client';
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AI Blueprint Exam Generator</title>
        <meta name="description" content="Generate intelligent exam papers from question blueprints using AI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-slate-50 min-h-screen">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, system-ui, sans-serif',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
