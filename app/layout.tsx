import type { Metadata } from "next";

import { NavbarGate } from "@/src/components/NavbarGate";
import { SmoothScrollProvider } from "@/src/components/SmoothScrollProvider";

import "./globals.css";

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
    <html lang="en" className="antialiased">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/iir2jqd.css" />
      </head>
      <body className="flex min-h-dvh flex-col bg-[color:var(--color-sand-100)]">
        <SmoothScrollProvider>
          <NavbarGate />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
