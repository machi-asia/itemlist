import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RimWorld Calculator | Colony Production Suite",
  description: "Colony manufacturing, fabrication bench, and recipe throughput planner for RimWorld.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-screen overflow-hidden">
      <body className="antialiased h-screen overflow-hidden bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
