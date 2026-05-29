import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CustomCursor } from "@/src/components/CustomCursor";
import { NavbarGate } from "@/src/components/NavbarGate";
import { PageTransition } from "@/src/components/PageTransition";
import { SmoothScrollProvider } from "@/src/components/SmoothScrollProvider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter-google",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Product Design Portfolio",
  description: "Scaffold foundation for a product design portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/iir2jqd.css" />
      </head>
      <body className="flex min-h-dvh flex-col bg-[color:var(--color-sand-100)]">
        <SmoothScrollProvider>
          <NavbarGate />
          <PageTransition>
            <div className="flex min-h-0 flex-1 flex-col pt-[length:var(--site-nav-offset)]">
              {children}
            </div>
          </PageTransition>
          <CustomCursor />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
