import { GameCalculatorApp } from "@repo/game-calculator";
import { RIMWORLD_DATA } from "@repo/game-calculator/data";

export default function RimWorldCalculatorPage() {
  return <GameCalculatorApp dataset={RIMWORLD_DATA} />;
}
