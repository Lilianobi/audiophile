import './globals.css';
import { CartProvider } from '../lib/CartContext';
import MainLayout from '../components/layout/MainLayout';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Audiophile | Premium Audio Equipment',
  description: 'Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.',
  keywords: 'headphones, speakers, earphones, audio equipment, premium audio',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <CartProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </CartProvider>
      </body>
    </html>
  );
}