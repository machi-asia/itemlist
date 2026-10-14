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
  // Construct the sandboxed HTML for the ad
  const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
  </style>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>
</head>
<body>
  <ins class="adsbygoogle"
       style="display:inline-block;width:160px;height:600px"
       data-ad-client="${client}"
       ${slot ? `data-ad-slot="${slot}"` : ""}></ins>
  <script>
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  </script>
</body>
</html>`;

  return (
    <aside
      className={`hidden xl:flex flex-col shrink-0 bg-[#0c0d10] border-l border-zinc-800/80 w-[176px] 2xl:w-[200px] z-20 select-none ${className}`}
      aria-label="Advertisement Sidebar"
    >
      <div className="flex flex-col h-full w-full p-2 overflow-hidden items-center justify-start gap-2">
        {/* Ad Label */}
        <div className="flex items-center justify-between w-full px-1 shrink-0">
          <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-mono font-medium">
            Advertisement
          </span>
        </div>

        {/* Ad Banner Container (completely isolated in iframe sandbox) */}
        <div className="w-[160px] h-[600px] shrink-0 rounded-md bg-zinc-950/60 border border-dashed border-zinc-800/80 overflow-hidden flex items-center justify-center">
          <iframe
            title="Advertisement"
            srcDoc={adHtml}
            width={160}
            height={600}
            scrolling="no"
            tabIndex={-1}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            className="w-[160px] h-[600px] border-0 overflow-hidden block"
          />
        </div>
      </div>
    </aside>
  );
}

// Backwards-compatible export
export const RightAdSidebar = AdSidebar;
export const LeftAdSidebar = AdSidebar;
