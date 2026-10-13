import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Production Calculator Hub",
  description: "Select a game to plan manufacturing, optimize ratios, calculate machine counts, and explore interactive recipe trees.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
