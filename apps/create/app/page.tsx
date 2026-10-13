import { GameCalculatorApp } from "@repo/game-calculator";
import { CREATE_DATA } from "@repo/game-calculator/data";

export default function CreateCalculatorPage() {
  return <GameCalculatorApp dataset={CREATE_DATA} />;
}
