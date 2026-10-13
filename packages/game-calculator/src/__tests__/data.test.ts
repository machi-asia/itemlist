import { describe, it, expect } from "vitest";
import { CREATE_DATA, RIMWORLD_DATA } from "../data";

describe("Game Datasets", () => {
  it("validates Create dataset integrity", () => {
    expect(CREATE_DATA.id).toBe("create");
    expect(CREATE_DATA.items.length).toBeGreaterThan(0);
    const seenIds = new Set<string>();
    const duplicateIds: string[] = [];
    for (const item of CREATE_DATA.items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
      if (seenIds.has(item.id)) {
        duplicateIds.push(item.id);
      }
      seenIds.add(item.id);
    }
    expect(duplicateIds).toEqual([]);

    // Verify Sturdy Sheet recipe
    const sturdy = CREATE_DATA.items.find((i) => i.id === "sturdy-sheet");
    expect(sturdy).toBeDefined();
    expect(sturdy?.recipes?.length).toBeGreaterThan(0);
    const sturdyValid = sturdy?.recipes?.some((r) =>
      r.outputs.some((o) => o.itemId === "sturdy-sheet")
    );
    expect(sturdyValid).toBe(true);

    // Verify Andesite, Brass, Copper, and Train Casings recipes
    const casings = ["andesite-casing", "brass-casing", "copper-casing", "train-casing"];
    for (const cId of casings) {
      const casing = CREATE_DATA.items.find((i) => i.id === cId);
      expect(casing).toBeDefined();
      expect(casing?.recipes?.length).toBeGreaterThan(0);
      const casingValid = casing?.recipes?.some((r) =>
        r.outputs.some((o) => o.itemId === cId)
      );
      expect(casingValid).toBe(true);
    }

    // Verify Cake and essential vanilla craftables
    const cake = CREATE_DATA.items.find((i) => i.id === "cake");
    expect(cake).toBeDefined();
    expect(cake?.recipes?.length).toBeGreaterThan(0);
    const cakeRecipe = cake?.recipes?.find((r) => r.method === "Mechanical Crafting");
    expect(cakeRecipe).toBeDefined();
    expect(cakeRecipe?.ingredients.map((ing) => ing.itemId).sort()).toEqual([
      "egg",
      "milk-bucket",
      "sugar",
      "wheat"
    ]);

    const vanillaItems = ["iron-block", "piston", "sticky-piston", "hopper", "shears", "bucket", "bow", "tnt"];
    for (const vId of vanillaItems) {
      const vItem = CREATE_DATA.items.find((i) => i.id === vId);
      expect(vItem).toBeDefined();
      expect(vItem?.recipes?.length).toBeGreaterThan(0);
    }
  });

  it("validates RimWorld dataset integrity", () => {
    expect(RIMWORLD_DATA.id).toBe("rimworld");
    expect(RIMWORLD_DATA.items.length).toBeGreaterThan(0);
    for (const item of RIMWORLD_DATA.items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    }
  });
});
