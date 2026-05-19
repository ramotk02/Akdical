import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKDICAL",
  description: "Outil de suivi des calculs achats",
  icons: {
    icon: "/favicon.ico",
    apple: "/image.png",        
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}