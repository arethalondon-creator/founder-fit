import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Founder Fit — Environment Demand vs. Cognitive Capacity",
  description:
    "A precision instrument that maps where your business environment and your cognitive capacity are in friction.",
  openGraph: {
    title: "Founder Fit",
    description:
      "Map where your business environment and cognitive capacity are in friction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ backgroundColor: "#dad7cd", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
