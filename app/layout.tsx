import type { Metadata } from "next";
import { Rubik_Dirt, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const rubikDirt = Rubik_Dirt({
  weight: "400",
  variable: "--font-rubik-dirt",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wurmz — Organic Living Soil",
  description:
    "Craft cannabis grown in organic living soil. No synthetics, no shortcuts — just nature doing what nature does.",
  openGraph: {
    title: "Wurmz — Organic Living Soil",
    description:
      "Craft cannabis grown in organic living soil. No synthetics, no shortcuts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rubikDirt.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
