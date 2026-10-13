import { describe, it, expect } from "vitest";
import { calculateRecipeGraph } from "../graph-builder";
import type { GameItem } from "../../types/data";

const MOCK_ITEMS: GameItem[] = [
  {
    id: "iron-ore",
    name: "Iron Ore",
    category: "Raw",
    icon: "🪨",
    description: "Raw iron ore",
    recipes: [],
  },
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    category: "Ingots",
    icon: "🧱",
    description: "Smelted iron ingot",
    recipes: [
      {
        id: "recipe-smelt-iron",
        name: "Smelt Iron Ingot",
        buildingRequired: "Furnace",
        processingTimeSeconds: 2,
        ingredients: [{ itemId: "iron-ore", itemName: "Iron Ore", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
      },
    ],
  },
  {
    id: "iron-sheet",
    name: "Iron Sheet",
    category: "Sheets",
    icon: "⚙️",
    description: "Pressed iron sheet",
    recipes: [
      {
        id: "recipe-press-sheet",
        name: "Press Iron Sheet",
        buildingRequired: "Press",
        processingTimeSeconds: 1,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        outputs: [{ itemId: "iron-sheet", itemName: "Iron Sheet", amount: 1 }],
      },
    ],
  },
];

describe("calculateRecipeGraph", () => {
  it("calculates correct machine counts and raw ingredients for a single tier", () => {
    const result = calculateRecipeGraph(MOCK_ITEMS, [
      { itemId: "iron-ingot", targetQuantityPerMinute: 60 },
    ]);

    expect(result.nodes).toHaveLength(2); // iron-ingot and iron-ore
    expect(result.totalBuildings["Furnace"]).toBe(2); // 60/min with 2s processing (30/min per machine) -> 2 machines
    expect(result.rawIngredients).toHaveLength(1);
    expect(result.rawIngredients[0]?.itemName).toBe("Iron Ore");
    expect(result.rawIngredients[0]?.requiredPerMinute).toBe(60);
  });

  it("calculates multi-tier dependencies correctly", () => {
    const result = calculateRecipeGraph(MOCK_ITEMS, [
      { itemId: "iron-sheet", targetQuantityPerMinute: 60 },
    ]);

    expect(result.nodes).toHaveLength(3); // iron-sheet, iron-ingot, iron-ore
    expect(result.totalBuildings["Press"]).toBe(1);
    expect(result.totalBuildings["Furnace"]).toBe(2);
    expect(result.rawIngredients[0]?.requiredPerMinute).toBe(60);
  });
});
