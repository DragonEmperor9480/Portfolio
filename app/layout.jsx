import StyledComponentsRegistry from './lib/registry';
import './globals.css';

export const metadata = {
  title: 'Amrutesh Naregal | Portfolio',
  description:
    "Explore Amrutesh Naregal's portfolio — a tech enthusiast passionate about full-stack development, DevOps, cloud engineering, and AI-powered applications.",
  keywords: [
    'Amrutesh Naregal',
    'Full-Stack Developer',
    'DevOps',
    'Cloud Engineer',
    'AI',
    'Web Development',
    'JavaScript',
    'Node.js',
    'MongoDB',
    'Linux',
    'Android',
    'ROM Developer',
  ],
  authors: [{ name: 'Amrutesh Naregal' }],
  creator: 'Amrutesh Naregal',
  metadataBase: new URL('https://amrut.amrutlabs.in'),
  openGraph: {
    title: 'Amrutesh Naregal | Portfolio',
    description:
      "Explore Amrutesh Naregal's portfolio — a tech enthusiast passionate about full-stack development, DevOps, and AI-powered applications.",
    url: 'https://amrut.amrutlabs.in/',
    siteName: 'Amrutesh Naregal Portfolio',
    images: [
      {
        url: '/preview-image.png',
        width: 1200,
        height: 630,
        alt: 'Amrutesh Naregal Portfolio',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amrutesh Naregal | Portfolio',
    description:
      "Explore Amrutesh Naregal's portfolio — a tech enthusiast passionate about full-stack development, DevOps, and AI-powered applications.",
    images: ['/preview-image.png'],
  },
  verification: {
    google: 'DL4XK4ctN-9ncff_igAsFfPGyFaIIq057tN-lMJS8Mc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />

        {/* CDNs and Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdnjs.cloudflare.com"
          crossOrigin="anonymous"
        />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;500;700&family=Orbitron:wght@500;700;900&family=Rajdhani:wght@500;600;700&family=Syne:wght@500;700;800&family=Oxanium:wght@400;600;700&family=JetBrains+Mono:wght@400;700&family=DM+Mono:wght@400&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Amrutesh Naregal',
              url: 'https://amrut.amrutlabs.in',
              sameAs: [
                'https://github.com/DragonEmperor9480',
                'https://www.linkedin.com/in/amrutesh-naregal',
                'https://t.me/Kamisato_Amrut',
              ],
              jobTitle: 'Full-Stack Developer & Cloud Engineer',
              description:
                'Tech enthusiast passionate about full-stack development, DevOps, cloud engineering, and AI-powered applications.',
            }),
          }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
