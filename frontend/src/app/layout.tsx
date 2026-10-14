import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined ? process.env.NEXT_PUBLIC_BASE_PATH : '/kiosk';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ehwonderonline.com/kiosk'),
  title: 'Elephant House Ice Cream | Sampath Bat AR Cricket Catch Game',
  description: 'Detect your cricket bat via camera and swing to catch delicious falling Elephant House ice creams! Score runs and climb the leaderboard in this interactive AR camera game.',
  keywords: ['Elephant House', 'Ice Cream', 'Cricket Bat', 'AR Game', 'Sampath Bat', 'Camera Game', 'Sri Lanka'],
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon.png`, type: 'image/png' },
      { url: `${basePath}/logo.png`, type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/logo.png`,
  },
  openGraph: {
    title: 'Elephant House & Sampath Bat AR Cricket Catch Game',
    description: 'Detect your cricket bat via camera and swing to catch falling popsicles and ice creams!',
    type: 'website',
    url: 'https://ehwonderonline.com/kiosk/',
    siteName: 'Elephant House Wonder Game',
    images: [
      {
        url: 'https://ehwonderonline.com/kiosk/og_image.png',
        secureUrl: 'https://ehwonderonline.com/kiosk/og_image.png',
        width: 1200,
        height: 630,
        alt: 'Sampath Bat AR Cricket Catch Game',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elephant House & Sampath Bat AR Cricket Catch Game',
    description: 'Detect your cricket bat via camera and swing to catch falling popsicles and ice creams!',
    images: ['https://ehwonderonline.com/kiosk/og_image.png'],
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617'
};

import SecurityShield from '@/components/SecurityShield';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} antialiased bg-slate-950 text-slate-100 min-h-screen`}>
        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E5F9K3PN4W"
        />
        <script
          id="ga-inline"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E5F9K3PN4W', {
                send_page_view: true
              });
            `,
          }}
        />
        <SecurityShield />
        {children}
      </body>
    </html>
  );
}
