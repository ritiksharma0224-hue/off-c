import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Off Culture Jaipur | Gen-Z Streetwear Store in Mansarovar",
  description:
    "Shop affordable Gen-Z streetwear, oversized tees, boxy fits, cropped shirts, graphic tees, and casual apparel at Off Culture Jaipur, located near VT Road Circle, Mansarovar.",
  keywords:
    "Off Culture Jaipur, streetwear Jaipur, oversized t-shirts Jaipur, boxy fit t-shirts Jaipur, cropped shirts Jaipur, Gen-Z fashion Jaipur, affordable fashion Jaipur, Mansarovar clothing store, oversized tees, crop shirts",
  authors: [{ name: "Off Culture Jaipur" }],
  openGraph: {
    title: "Off Culture Jaipur | Gen-Z Streetwear Store in Mansarovar",
    description:
      "Shop affordable Gen-Z streetwear, oversized tees, boxy fits, cropped shirts, graphic tees, and casual apparel at Off Culture Jaipur, Mansarovar.",
    url: "https://offculturejaipur.com", // Placeholder
    siteName: "Off Culture Jaipur",
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
        {/* Local Business JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Off Culture Jaipur",
              "description":
                "Gen-Z streetwear retail store in Mansarovar, Jaipur offering oversized fits, cropped shirts, and graphic tees starting around ₹599.",
              "url": "https://offculturejaipur.com", // Placeholder
              "telephone": "+919999999999",
              "address": {
                "@type": "PostalAddress",
                "streetAddress":
                  "Shop No. 03, Basement, opposite Muthoot Finance, VT Road Circle, Mansarovar",
                "addressLocality": "Jaipur",
                "addressRegion": "Rajasthan",
                "postalCode": "302020",
                "addressCountry": "IN",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.8613122",
                "longitude": "75.763475",
              },
              "priceRange": "$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                "opens": "11:00",
                "closes": "21:30",
              },
              "sameAs": ["https://www.instagram.com/offculturejaipur/"],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-base-cream text-text-black selection:bg-electric-blue selection:text-white relative">
        {/* Grain Overlay */}
        <div className="noise-overlay" />
        
        {/* Interactive Custom Cursor */}
        <CustomCursor />
        
        {/* Navigation Header */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>
        
        {/* Footer Area */}
        <Footer />
      </body>
    </html>
  );
}
