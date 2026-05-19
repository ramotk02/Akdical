import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKDICAL",
  description: "Outil de suivi des calculs achats",
  icons: {
    icon: "/image.png",          
    shortcut: "/image.png",
    apple: "/image.png",          
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