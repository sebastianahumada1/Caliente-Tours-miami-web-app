import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./providers/LenisProvider";
import { Navbar } from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caliente Tours Miami — Miami Yacht Rentals",
  description:
    "Experience luxury yacht rentals in Miami. Book your private yacht charter for an unforgettable experience on the beautiful waters of Miami.",
  keywords: ["Miami yacht rentals", "yacht charter Miami", "boat rental Miami"],
  openGraph: {
    title: "Caliente Tours Miami — Miami Yacht Rentals",
    description:
      "Experience luxury yacht rentals in Miami. Book your private yacht charter.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caliente Tours Miami — Miami Yacht Rentals",
    description: "Experience luxury yacht rentals in Miami.",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

