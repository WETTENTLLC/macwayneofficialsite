import type { Metadata } from 'next';
import { Bebas_Neue } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation_simple';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'Mac Wayne Official - Blind & Battered',
  description: 'Official website of Mac Wayne - Blind rapper, storyteller, and visionary. Watch the official Blind & Battered video and explore Mac Wayne\'s music.',
  keywords: 'Mac Wayne, blind rapper, Blind & Battered, music, documentary, prison music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${bebasNeue.variable} antialiased strange-theme`}>
        <Providers>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
