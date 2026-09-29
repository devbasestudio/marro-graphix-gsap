import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marro-graphix-gsap.vercel.app"),
  title: "MARRO GRAPHIX — Graphic Designer",
  description:
    "Myanmar graphic designer with freelance experience since 2024 and one year at Clean Pro, creating targeted campaigns for Clean Pro, BusyBees, and Nilfisk.",
  keywords: [
    "MARRO GRAPHIX",
    "graphic designer Myanmar",
    "graphic designer",
    "freelance graphic designer",
    "Clean Pro designer",
    "social media design",
    "brand identity",
    "advertising design",
  ],
  openGraph: {
    title: "MARRO GRAPHIX — Ideas Made Visible",
    description: "Professional social media campaigns, product advertising, and student practice work by MARRO GRAPHIX.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 909,
        alt: "MARRO GRAPHIX — Ideas Made Visible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARRO GRAPHIX — Ideas Made Visible",
    description: "Professional social media campaigns, product advertising, and student practice work by MARRO GRAPHIX.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  other: {
    "theme-color": "#0a0a0a",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
