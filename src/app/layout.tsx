import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Infinite Automationz Portal',
  description: 'Infinite Automationz client operations portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
