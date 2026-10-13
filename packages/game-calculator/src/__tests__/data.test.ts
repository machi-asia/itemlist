import { describe, it, expect } from "vitest";
import { CREATE_DATA, RIMWORLD_DATA } from "../data";

describe("Game Datasets", () => {
  it("validates Create dataset integrity", () => {
    expect(CREATE_DATA.id).toBe("create");
    expect(CREATE_DATA.items.length).toBeGreaterThan(0);
    for (const item of CREATE_DATA.items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    }

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
