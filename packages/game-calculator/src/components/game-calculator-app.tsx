import React from "react";
import type { GameDataset } from "../types/data";
import { GameHeader } from "./game-header";
import { GameCalculatorView } from "./game-calculator-view";

export interface GameCalculatorAppProps {
  dataset: GameDataset;
}

export function GameCalculatorApp({ dataset }: GameCalculatorAppProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <main className="flex-1 w-full h-full min-h-0 overflow-hidden">
        <GameCalculatorView dataset={dataset} />
      </main>
    </div>
  );
}
