import type { Metadata } from "next";
import Navigation from "@/components/ui/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewsHub - Stay Informed with Latest News",
  description: "Modern news aggregation platform featuring breaking news, politics, technology, sports, and more from trusted sources worldwide.",
  keywords: "news, breaking news, politics, technology, sports, world news",
  openGraph: {
    title: "NewsHub - Stay Informed with Latest News",
    description: "Modern news aggregation platform featuring breaking news, politics, technology, sports, and more from trusted sources worldwide.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "NewsHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsHub - Stay Informed with Latest News",
    description: "Modern news aggregation platform featuring breaking news, politics, technology, sports, and more from trusted sources worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
