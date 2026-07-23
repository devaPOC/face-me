import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faceme.switchspace.in"),
  title: {
    default: "FaceMe — Peer-to-Peer Video Calling | Instant 1-on-1 Calls",
    template: "%s | FaceMe",
  },
  description:
    "Ultra-low latency, zero-persistence 1-to-1 peer-to-peer video calling application powered by WebRTC, Next.js 16, and Go. No accounts, no trackings, completely private browser-to-browser media streaming.",
  keywords: [
    "FaceMe",
    "WebRTC",
    "P2P Video Call",
    "Peer-to-Peer Video Chat",
    "FaceTime Clone",
    "Private Video Calling",
    "Zero Persistence Chat",
    "Browser Video Call",
    "Open Source FaceTime",
    "Go WebRTC Signaling",
  ],
  authors: [{ name: "FaceMe", url: "https://faceme.switchspace.in" }],
  creator: "FaceMe",
  publisher: "FaceMe",
  applicationName: "FaceMe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://faceme.switchspace.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://faceme.switchspace.in",
    siteName: "FaceMe",
    title: "FaceMe — Peer-to-Peer Video Calling | Instant 1-on-1 Calls",
    description:
      "Ultra-low latency, zero-persistence 1-to-1 peer-to-peer video calling powered by WebRTC and Go. Instant private calls with no registration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaceMe — Peer-to-Peer Video Calling",
    description:
      "Instant, zero-persistence 1-to-1 peer-to-peer WebRTC video calls. No signups, no downloads, end-to-end media privacy.",
    creator: "@faceme",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FaceMe",
  url: "https://faceme.switchspace.in",
  description:
    "Ultra-low latency, zero-persistence 1-to-1 peer-to-peer video calling application built with WebRTC, Next.js, and Go.",
  applicationCategory: "CommunicationApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Peer-to-peer video calling via WebRTC",
    "Zero persistence in-memory signaling server",
    "Knocking & waiting room access controls",
    "Microphone & camera selector",
    "Hand raise notifications",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden font-body-md text-on-background selection:bg-secondary-container selection:text-on-secondary-container">{children}</body>
    </html>
  );
}
