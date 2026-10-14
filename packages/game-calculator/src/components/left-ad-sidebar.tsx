"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface LeftAdSidebarProps {
  client?: string;
  slot?: string;
}

export function LeftAdSidebar({
  client = "ca-pub-2144375932551709",
  slot,
}: LeftAdSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Trigger adsbygoogle push if loaded
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      }
    } catch {
      // Ignored if ad blocker or already populated
    }
  }, [isCollapsed]);

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
        className={`hidden lg:flex flex-col shrink-0 h-full bg-[#0c0d10] border-r border-zinc-800/80 transition-all duration-200 relative z-20 ${
          isCollapsed ? "w-7" : "w-[160px] xl:w-[200px]"
        }`}
        aria-label="Advertisement Sidebar"
      >
        {/* Toggle Collapse Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-4 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-md cursor-pointer"
          title={isCollapsed ? "Expand advertisement" : "Collapse advertisement"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {isCollapsed ? (
          <div className="flex h-full w-full items-center justify-center py-6 select-none cursor-pointer" onClick={() => setIsCollapsed(false)}>
            <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-mono rotate-90 whitespace-nowrap">
              Advertisement
            </span>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full p-2 overflow-hidden items-center justify-start gap-2">
            {/* Ad Label */}
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-mono font-medium">
                Sponsored
              </span>
            </div>

            {/* Ad Container */}
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
        )}
      </aside>
    </>
  );
}
