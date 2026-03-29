import type { Metadata } from "next";
import { Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WalletProvider from "@/components/WalletProvider";
import { ToastProvider } from "@/components/Toast";
import PageTransition from "@/components/PageTransition";
import VantaBackground from "@/components/VantaBackground";

const instrumentSans = Instrument_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "royalties.fun",
  description: "Buy and sell creator royalties on-chain. Creators raise capital. Investors trade future revenue.",
  icons: {
    icon: "/newlogo.jpg",
    shortcut: "/newlogo.jpg",
    apple: "/newlogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${ibmPlexMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        <WalletProvider>
          <ToastProvider>
            <div className="relative min-h-screen overflow-hidden flex flex-col">
              <VantaBackground />
              <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
              <Navbar />
              <main className="relative z-10 flex-1">
                <PageTransition className="min-h-full">
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
