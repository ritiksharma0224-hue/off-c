import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import KapdologyVideoPreloader from "@/components/KapdologyVideoPreloader";

export const metadata: Metadata = {
  title: "KAPDOLOGY® — Not Just Clothes. It's a Mood.",
  description:
    "Kapdology is a Jaipur-born Gen-Z streetwear brand built around identity, graphics, attitude and culture.",
  keywords:
    "KAPDOLOGY, KAPDOLOGY streetwear, Indian streetwear brand, Gen-Z streetwear, oversized t-shirts India, boxy fit streetwear, streetwear brand Jaipur",
  authors: [{ name: "KAPDOLOGY®" }],
  openGraph: {
    title: "KAPDOLOGY® — Not Just Clothes. It's a Mood.",
    description:
      "Kapdology is a Jaipur-born Gen-Z streetwear brand built around identity, graphics, attitude and culture.",
    url: "https://kapdology.com",
    siteName: "KAPDOLOGY®",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "KAPDOLOGY®",
              "description":
                "Independent Indian Gen-Z streetwear brand offering luxury oversized fits, graphic tees, and raw streetwear silhouettes.",
              "url": "https://kapdology.com",
              "priceRange": "$$",
              "sameAs": ["https://www.instagram.com/kapdology/"],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-base-cream text-text-black selection:bg-[#FF3B00] selection:text-white relative">
        {/* KAPDOLOGY Full-screen Video Preloader */}
        <KapdologyVideoPreloader />

        {/* Grain Overlay */}
        <div className="noise-overlay" />

        {/* Custom Cursor */}
        <CustomCursor />

        {/* Navigation Header */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
