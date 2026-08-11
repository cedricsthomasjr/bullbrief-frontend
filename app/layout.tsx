import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import GlobalSideNav from "./components/GlobalSideNav";
import ClientShell from "./components/ClientShell";
import Footer from "./components/Footer";
import SitewideLegalNotice from "./components/SitewideLegalNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BullBrief — AI-Powered Stock Research",
  description: "Instant stock research briefs covering earnings, fundamentals, valuation pillars, SEC risks, and business drivers. Free. No paywall.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#060c1a" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} font-sans antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: "#060c1a", color: "#eff6ff" }}
      >
        <ClientShell>
          <Navbar />
          <GlobalSideNav />
          <div className="flex-grow">
            {children}
          </div>
          <SitewideLegalNotice />
          <Footer />
        </ClientShell>
      </body>
    </html>
  );
}
