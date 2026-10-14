"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export interface AdSidebarProps {
  client?: string;
  slot?: string;
  className?: string;
}

export function AdSidebar({
  client = "ca-pub-2144375932551709",
  slot,
  className = "",
}: AdSidebarProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch {
      // Ignored if ad blocker is active or slot already pushed
    }
  }, []);

  return (
    <>
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <aside
        className={`hidden xl:flex flex-col shrink-0 bg-[#0c0d10] border-l border-zinc-800/80 w-[160px] 2xl:w-[200px] z-20 ${className}`}
        aria-label="Advertisement Sidebar"
      >
        <div className="flex flex-col h-full w-full p-2 overflow-hidden items-center justify-start gap-2 sticky top-4">
          {/* Ad Label */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-mono font-medium">
              Advertisement
            </span>
          </div>

          {/* Ad Banner Container (always visible skyscraper) */}
          <div className="flex-1 w-full min-h-[600px] flex items-center justify-center rounded-md bg-zinc-950/60 border border-dashed border-zinc-800/80 overflow-hidden text-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "100%", minHeight: "600px" }}
              data-ad-client={client}
              {...(slot ? { "data-ad-slot": slot } : {})}
              data-ad-format="vertical"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </aside>
    </>
  );
}

// Backwards-compatible export
export const RightAdSidebar = AdSidebar;
export const LeftAdSidebar = AdSidebar;
