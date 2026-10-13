import React from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import type { GameDataset } from "../types/data";

interface GameHeaderProps {
  dataset: GameDataset;
}

export function GameHeader({ dataset }: GameHeaderProps) {
  const homeUrl = dataset.homeUrl || "/";

  return (
    <header className="bg-transparent border-b border-zinc-800/40 sticky top-0 z-40 backdrop-blur-md">
      <div className="w-full px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={homeUrl}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] rounded-lg px-2.5 py-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home Directory
          </Link>
          <div className="h-4 w-px bg-zinc-800/60" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600/20 text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">
                {dataset.name} Calculator
              </h1>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                {dataset.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          {dataset.items.length} Registered Items
        </div>
      </div>
    </header>
  );
}
