import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Mod Calculator | Game Production Suite",
  description: "Kinetic automation, sequenced assembly, and recipe rate planner for Minecraft Create mod.",
  referrer: "no-referrer",
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
