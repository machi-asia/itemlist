import type { GameItem } from "../types/data";
import { RAW_ITEM_ICONS } from "./raw-item-icons";

function getIcon(name: string, fallbackSlug: string): string {
  if (RAW_ITEM_ICONS[name]) return RAW_ITEM_ICONS[name];
  return `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${fallbackSlug}.png`;
}

function getBlockIcon(name: string, fallbackSlug: string): string {
  if (RAW_ITEM_ICONS[name]) return RAW_ITEM_ICONS[name];
  return `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/block/${fallbackSlug}.png`;
}

export const VANILLA_CRAFTING_ITEMS: GameItem[] = [
  // --- Basic Materials & Smelted Metals (Fan + Lava) ---
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    category: "Materials & Resources",
    icon: getIcon("Iron Ingot", "iron_ingot"),
    description: "Versatile metal ingot. Smelted with Encased Fan + Lava (Bulk Blasting) or crafted with Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-iron",
        name: "Bulk Blasting (from Raw Iron)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-iron", itemName: "Raw Iron", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-iron-ore",
        name: "Bulk Blasting (from Iron Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "iron-ore", itemName: "Iron Ore", amount: 1 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-iron-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Iron Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-nugget", itemName: "Iron Nugget", amount: 9 }],
        outputs: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "copper-ingot",
    name: "Copper Ingot",
    category: "Materials & Resources",
    icon: getIcon("Copper Ingot", "copper_ingot"),
    description: "Conductor metal. Smelted with Encased Fan + Lava or crafted from Block of Copper.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-copper",
        name: "Bulk Blasting (from Raw Copper)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-copper", itemName: "Raw Copper", amount: 1 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-copper-ore",
        name: "Bulk Blasting (from Copper Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "copper-ore", itemName: "Copper Ore", amount: 1 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-copper-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Copper Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "copper-nugget", itemName: "Copper Nugget", amount: 9 }],
        outputs: [{ itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "zinc-ingot",
    name: "Zinc Ingot",
    category: "Materials & Resources",
    icon: getIcon("Zinc Ingot", "iron_ingot"),
    description: "Essential component for Andesite Alloy and Brass.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-fan-blasting-raw-zinc",
        name: "Bulk Blasting (from Raw Zinc)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-zinc", itemName: "Raw Zinc", amount: 1 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-fan-blasting-zinc-ore",
        name: "Bulk Blasting (from Zinc Ore)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "zinc-ore", itemName: "Zinc Ore", amount: 1 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-zinc-ingot-crafter-nuggets",
        name: "Mechanical Crafter - Zinc Ingot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "zinc-nugget", itemName: "Zinc Nugget", amount: 9 }],
        outputs: [{ itemId: "zinc-ingot", itemName: "Zinc Ingot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "block-of-iron",
    name: "Block of Iron",
    category: "Materials & Resources",
    icon: getBlockIcon("Block of Iron", "iron_block"),
    description: "Solid block of iron crafted with 9 Iron Ingots in a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-block-of-iron-crafter",
        name: "Mechanical Crafter - Block of Iron",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 9 }],
        outputs: [{ itemId: "block-of-iron", itemName: "Block of Iron", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stick",
    name: "Stick",
    category: "Components & Tools",
    icon: getIcon("Stick", "stick"),
    description: "Basic crafting wooden stick crafted with planks in a Mechanical Crafter or Saw.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-stick-crafter-planks",
        name: "Mechanical Crafter - Stick",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 2 }],
        outputs: [{ itemId: "stick", itemName: "Stick", amount: 4 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "crafting-table",
    name: "Crafting Table",
    category: "Building & Decoration",
    icon: getBlockIcon("Crafting Table", "crafting_table"),
    description: "Standard crafting table made from 4 wooden planks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-crafting-table-crafter",
        name: "Mechanical Crafter - Crafting Table",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 4 }],
        outputs: [{ itemId: "crafting-table", itemName: "Crafting Table", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "chest",
    name: "Chest",
    category: "Logistics & Fluids",
    icon: getBlockIcon("Chest", "chest"),
    description: "Single storage container crafted from 8 wooden planks.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-chest-crafter",
        name: "Mechanical Crafter - Chest",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "any-planks", itemName: "Any Planks", amount: 8 }],
        outputs: [{ itemId: "chest", itemName: "Chest", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "barrel",
    name: "Barrel",
    category: "Logistics & Fluids",
    icon: getBlockIcon("Barrel", "barrel_top"),
    description: "Compact storage block crafted from planks and wooden slabs.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-barrel-crafter",
        name: "Mechanical Crafter - Barrel",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "any-planks", itemName: "Any Planks", amount: 6 },
          { itemId: "any-wood-slab", itemName: "Any Wood Slab", amount: 2 }
        ],
        outputs: [{ itemId: "barrel", itemName: "Barrel", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "furnace",
    name: "Furnace",
    category: "Building & Decoration",
    icon: getBlockIcon("Furnace", "furnace_front"),
    description: "Cobblestone furnace crafted in a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-furnace-crafter",
        name: "Mechanical Crafter - Furnace",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "cobblestone", itemName: "Cobblestone", amount: 8 }],
        outputs: [{ itemId: "furnace", itemName: "Furnace", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "iron-bars",
    name: "Iron Bars",
    category: "Building & Decoration",
    icon: getBlockIcon("Iron Bars", "iron_bars"),
    description: "Metal bars crafted from 6 Iron Ingots.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-iron-bars-crafter",
        name: "Mechanical Crafter - Iron Bars",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", amount: 6 }],
        outputs: [{ itemId: "iron-bars", itemName: "Iron Bars", amount: 16 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "hopper",
    name: "Hopper",
    category: "Logistics & Fluids",
    icon: getIcon("Hopper", "hopper"),
    description: "Item funnel and transfer device crafted from 5 Iron Ingots and a Chest.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-hopper-crafter",
        name: "Mechanical Crafter - Hopper",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 5 },
          { itemId: "chest", itemName: "Chest", amount: 1 }
        ],
        outputs: [{ itemId: "hopper", itemName: "Hopper", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "piston",
    name: "Piston",
    category: "Redstone & Displays",
    icon: getBlockIcon("Piston", "piston_top"),
    description: "Redstone mechanical pusher crafted in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-piston-crafter",
        name: "Mechanical Crafter - Piston",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "any-planks", itemName: "Any Planks", amount: 3 },
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 4 },
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 1 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "piston", itemName: "Piston", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "observer",
    name: "Observer",
    category: "Redstone & Displays",
    icon: getBlockIcon("Observer", "observer_front"),
    description: "Block update detector crafted from Cobblestone, Redstone Dust, and Nether Quartz.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-observer-crafter",
        name: "Mechanical Crafter - Observer",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 6 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 2 },
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 }
        ],
        outputs: [{ itemId: "observer", itemName: "Observer", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-torch",
    name: "Redstone Torch",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Torch", "redstone_torch"),
    description: "Constant redstone power source crafted from Redstone Dust and a Stick.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-torch-crafter",
        name: "Mechanical Crafter - Redstone Torch",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 },
          { itemId: "stick", itemName: "Stick", amount: 1 }
        ],
        outputs: [{ itemId: "redstone-torch", itemName: "Redstone Torch", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-repeater",
    name: "Redstone Repeater",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Repeater", "repeater"),
    description: "Signal booster and delay circuit component.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-repeater-crafter",
        name: "Mechanical Crafter - Redstone Repeater",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-torch", itemName: "Redstone Torch", amount: 2 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 },
          { itemId: "any-stone", itemName: "Any Stone", amount: 3 }
        ],
        outputs: [{ itemId: "redstone-repeater", itemName: "Redstone Repeater", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "redstone-comparator",
    name: "Redstone Comparator",
    category: "Redstone & Displays",
    icon: getIcon("Redstone Comparator", "comparator"),
    description: "Analyzes container fullness and compares signal strengths.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-redstone-comparator-crafter",
        name: "Mechanical Crafter - Redstone Comparator",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "redstone-torch", itemName: "Redstone Torch", amount: 3 },
          { itemId: "nether-quartz", itemName: "Nether Quartz", amount: 1 },
          { itemId: "any-stone", itemName: "Any Stone", amount: 3 }
        ],
        outputs: [{ itemId: "redstone-comparator", itemName: "Redstone Comparator", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "compass",
    name: "Compass",
    category: "Components & Tools",
    icon: getIcon("Compass", "compass_16"),
    description: "Navigation instrument crafted from 4 Iron Ingots and 1 Redstone Dust.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-compass-crafter",
        name: "Mechanical Crafter - Compass",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "iron-ingot", itemName: "Iron Ingot", amount: 4 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "compass", itemName: "Compass", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "clock",
    name: "Clock",
    category: "Components & Tools",
    icon: getIcon("Clock", "clock_16"),
    description: "Timekeeping tool crafted from 4 Gold Ingots and 1 Redstone Dust.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-clock-crafter",
        name: "Mechanical Crafter - Clock",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 4 },
          { itemId: "redstone-dust", itemName: "Redstone Dust", amount: 1 }
        ],
        outputs: [{ itemId: "clock", itemName: "Clock", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "lever",
    name: "Lever",
    category: "Redstone & Displays",
    icon: getIcon("Lever", "lever"),
    description: "Switch toggled by hand crafted from a Stick and Cobblestone.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-lever-crafter",
        name: "Mechanical Crafter - Lever",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "stick", itemName: "Stick", amount: 1 },
          { itemId: "cobblestone", itemName: "Cobblestone", amount: 1 }
        ],
        outputs: [{ itemId: "lever", itemName: "Lever", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dried-kelp",
    name: "Dried Kelp",
    category: "Food & Farming",
    icon: getIcon("Dried Kelp", "dried_kelp"),
    description: "Smoked kelp food and crafting resource made via Bulk Smoking (Encased Fan + Campfire).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-kelp",
        name: "Bulk Smoking (from Kelp)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "kelp", itemName: "Kelp", amount: 1 }],
        outputs: [{ itemId: "dried-kelp", itemName: "Dried Kelp", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "dried-kelp-block",
    name: "Dried Kelp Block",
    category: "Building & Decoration",
    icon: getBlockIcon("Dried Kelp Block", "dried_kelp_top"),
    description: "Compact block of 9 Dried Kelp crafted with a Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-dried-kelp-block-crafter",
        name: "Mechanical Crafter - Dried Kelp Block",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "dried-kelp", itemName: "Dried Kelp", amount: 9 }],
        outputs: [{ itemId: "dried-kelp-block", itemName: "Dried Kelp Block", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Cooked Foods (Bulk Smoking with Encased Fan + Campfire) ---
  {
    id: "cooked-beef",
    name: "Cooked Beef",
    category: "Food & Farming",
    icon: getIcon("Cooked Beef", "cooked_beef"),
    description: "Steak cooked with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-beef",
        name: "Bulk Smoking (from Raw Beef)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-beef", itemName: "Raw Beef", amount: 1 }],
        outputs: [{ itemId: "cooked-beef", itemName: "Cooked Beef", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-porkchop",
    name: "Cooked Porkchop",
    category: "Food & Farming",
    icon: getIcon("Cooked Porkchop", "cooked_porkchop"),
    description: "Tender porkchop cooked with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-porkchop",
        name: "Bulk Smoking (from Raw Porkchop)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-porkchop", itemName: "Raw Porkchop", amount: 1 }],
        outputs: [{ itemId: "cooked-porkchop", itemName: "Cooked Porkchop", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-chicken",
    name: "Cooked Chicken",
    category: "Food & Farming",
    icon: getIcon("Cooked Chicken", "cooked_chicken"),
    description: "Cooked chicken produced with Encased Fan + Campfire (Bulk Smoking).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-chicken",
        name: "Bulk Smoking (from Raw Chicken)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-chicken", itemName: "Raw Chicken", amount: 1 }],
        outputs: [{ itemId: "cooked-chicken", itemName: "Cooked Chicken", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-mutton",
    name: "Cooked Mutton",
    category: "Food & Farming",
    icon: getIcon("Cooked Mutton", "cooked_mutton"),
    description: "Cooked mutton smoked via Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-mutton",
        name: "Bulk Smoking (from Raw Mutton)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-mutton", itemName: "Raw Mutton", amount: 1 }],
        outputs: [{ itemId: "cooked-mutton", itemName: "Cooked Mutton", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-salmon",
    name: "Cooked Salmon",
    category: "Food & Farming",
    icon: getIcon("Cooked Salmon", "cooked_salmon"),
    description: "Smoked salmon prepared with Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-salmon",
        name: "Bulk Smoking (from Raw Salmon)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-salmon", itemName: "Raw Salmon", amount: 1 }],
        outputs: [{ itemId: "cooked-salmon", itemName: "Cooked Salmon", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cooked-cod",
    name: "Cooked Cod",
    category: "Food & Farming",
    icon: getIcon("Cooked Cod", "cooked_cod"),
    description: "Smoked cod prepared with Encased Fan + Campfire.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-raw-cod",
        name: "Bulk Smoking (from Raw Cod)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "raw-cod", itemName: "Raw Cod", amount: 1 }],
        outputs: [{ itemId: "cooked-cod", itemName: "Cooked Cod", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "baked-potato",
    name: "Baked Potato",
    category: "Food & Farming",
    icon: getIcon("Baked Potato", "baked_potato"),
    description: "Potato roasted via Bulk Smoking (Encased Fan + Campfire).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-potato",
        name: "Bulk Smoking (from Potato)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "potato", itemName: "Potato", amount: 1 }],
        outputs: [{ itemId: "baked-potato", itemName: "Baked Potato", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "bread",
    name: "Bread",
    category: "Food & Farming",
    icon: getIcon("Bread", "bread"),
    description: "Smoked from Dough with Encased Fan + Campfire, or crafted from 3 Wheat in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-smoking-dough",
        name: "Bulk Smoking (from Dough)",
        method: "Bulk Smoking",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "dough", itemName: "Dough", amount: 1 }],
        outputs: [{ itemId: "bread", itemName: "Bread", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-bread-crafter-wheat",
        name: "Mechanical Crafter - Bread",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [{ itemId: "wheat", itemName: "Wheat", amount: 3 }],
        outputs: [{ itemId: "bread", itemName: "Bread", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "golden-apple",
    name: "Golden Apple",
    category: "Food & Farming",
    icon: getIcon("Golden Apple", "golden_apple"),
    description: "Infused golden apple crafted in Mechanical Crafter from 8 Gold Ingots and an Apple.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-apple-crafter",
        name: "Mechanical Crafter - Golden Apple",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-ingot", itemName: "Gold Ingot", amount: 8 },
          { itemId: "apple", itemName: "Apple", amount: 1 }
        ],
        outputs: [{ itemId: "golden-apple", itemName: "Golden Apple", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "golden-carrot",
    name: "Golden Carrot",
    category: "Food & Farming",
    icon: getIcon("Golden Carrot", "golden_carrot"),
    description: "Nutritious golden carrot crafted in Mechanical Crafter from 8 Gold Nuggets and a Carrot.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-golden-carrot-crafter",
        name: "Mechanical Crafter - Golden Carrot",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-nugget", itemName: "Gold Nugget", amount: 8 },
          { itemId: "carrot", itemName: "Carrot", amount: 1 }
        ],
        outputs: [{ itemId: "golden-carrot", itemName: "Golden Carrot", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "glistering-melon-slice",
    name: "Glistering Melon Slice",
    category: "Food & Farming",
    icon: getIcon("Glistering Melon Slice", "glistering_melon_slice"),
    description: "Brewing ingredient crafted from 8 Gold Nuggets and a Melon Slice in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-glistering-melon-crafter",
        name: "Mechanical Crafter - Glistering Melon",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "gold-nugget", itemName: "Gold Nugget", amount: 8 },
          { itemId: "melon-slice", itemName: "Melon Slice", amount: 1 }
        ],
        outputs: [{ itemId: "glistering-melon-slice", itemName: "Glistering Melon Slice", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "pumpkin-pie",
    name: "Pumpkin Pie",
    category: "Food & Farming",
    icon: getIcon("Pumpkin Pie", "pumpkin_pie"),
    description: "Pastry crafted from Pumpkin, Sugar, and an Egg in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-pumpkin-pie-crafter",
        name: "Mechanical Crafter - Pumpkin Pie",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "pumpkin", itemName: "Pumpkin", amount: 1 },
          { itemId: "sugar", itemName: "Sugar", amount: 1 },
          { itemId: "egg", itemName: "Egg", amount: 1 }
        ],
        outputs: [{ itemId: "pumpkin-pie", itemName: "Pumpkin Pie", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "cookie",
    name: "Cookie",
    category: "Food & Farming",
    icon: getIcon("Cookie", "cookie"),
    description: "Baked sweet treat crafted from Wheat and Cocoa Beans in Mechanical Crafter.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-cookie-crafter",
        name: "Mechanical Crafter - Cookie",
        method: "Mechanical Crafting",
        buildingRequired: "Mechanical Crafter",
        processingTimeSeconds: 4,
        speedRpm: 64,
        ingredients: [
          { itemId: "wheat", itemName: "Wheat", amount: 2 },
          { itemId: "cocoa-beans", itemName: "Cocoa Beans", amount: 1 }
        ],
        outputs: [{ itemId: "cookie", itemName: "Cookie", amount: 8 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "smooth-stone",
    name: "Smooth Stone",
    category: "Materials & Resources",
    icon: getBlockIcon("Smooth Stone", "smooth_stone"),
    description: "Smelted stone processed via Bulk Blasting (Encased Fan + Lava).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-stone",
        name: "Bulk Blasting (from Stone)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "any-stone", itemName: "Any Stone", amount: 1 }],
        outputs: [{ itemId: "smooth-stone", itemName: "Smooth Stone", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "stone",
    name: "Stone",
    category: "Materials & Resources",
    icon: getBlockIcon("Stone", "stone"),
    description: "Refined rock smelted from Cobblestone via Bulk Blasting (Encased Fan + Lava).",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-cobblestone",
        name: "Bulk Blasting (from Cobblestone)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "cobblestone", itemName: "Cobblestone", amount: 1 }],
        outputs: [{ itemId: "stone", itemName: "Stone", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "charcoal",
    name: "Charcoal",
    category: "Materials & Resources",
    icon: getIcon("Charcoal", "charcoal"),
    description: "Combustible lump produced by Bulk Blasting wood logs with Encased Fan + Lava.",
    sourceMod: "Vanilla",
    recipes: [
      {
        id: "recipe-fan-blasting-logs",
        name: "Bulk Blasting (from Any Log)",
        method: "Bulk Blasting",
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: "any-log", itemName: "Any Log", amount: 1 }],
        outputs: [{ itemId: "charcoal", itemName: "Charcoal", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },

  // --- Specific Create Casings ---
  {
    id: "andesite-casing",
    name: "Andesite Casing",
    category: "Kinetics & Contraptions",
    icon: RAW_ITEM_ICONS["Andesite Casing"] || getBlockIcon("Andesite Casing", "andesite_casing"),
    description: "Structural casing used for standard kinetic components. Created by applying Andesite Alloy to stripped logs or stripped wood using a Deployer or manual click.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-andesite-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "andesite-alloy", itemName: "Andesite Alloy", amount: 1 }
        ],
        outputs: [{ itemId: "andesite-casing", itemName: "Andesite Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-andesite-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "andesite-alloy", itemName: "Andesite Alloy", amount: 1 }
        ],
        outputs: [{ itemId: "andesite-casing", itemName: "Andesite Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "brass-casing",
    name: "Brass Casing",
    category: "Kinetics & Contraptions",
    icon: RAW_ITEM_ICONS["Brass Casing"] || getBlockIcon("Brass Casing", "brass_casing"),
    description: "High-tier structural casing for smart automation and sequenced mechanisms. Created by applying a Brass Ingot to stripped logs or stripped wood using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-brass-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "brass-ingot", itemName: "Brass Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "brass-casing", itemName: "Brass Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-brass-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "brass-ingot", itemName: "Brass Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "brass-casing", itemName: "Brass Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "copper-casing",
    name: "Copper Casing",
    category: "Logistics & Fluids",
    icon: RAW_ITEM_ICONS["Copper Casing"] || getBlockIcon("Copper Casing", "copper_casing"),
    description: "Corrosion-resistant structural casing for fluid pumps, spouts, and tanks. Created by applying a Copper Ingot to stripped logs or stripped wood using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-copper-casing-log",
        name: "Deployer (from Stripped Log)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-log", itemName: "Stripped Log", amount: 1 },
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "copper-casing", itemName: "Copper Casing", amount: 1 }],
        sourceMod: "Create Mod"
      },
      {
        id: "recipe-deploying-copper-casing-wood",
        name: "Deployer (from Stripped Wood)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "stripped-wood", itemName: "Stripped Wood", amount: 1 },
          { itemId: "copper-ingot", itemName: "Copper Ingot", amount: 1 }
        ],
        outputs: [{ itemId: "copper-casing", itemName: "Copper Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  },
  {
    id: "train-casing",
    name: "Train Casing",
    category: "Trains & Rail",
    icon: RAW_ITEM_ICONS["Train Casing"] || getBlockIcon("Train Casing", "train_casing"),
    description: "Heavy reinforced casing for train stations, train controls, and train signals. Created by applying Sturdy Sheet to Brass Casing using a Deployer.",
    sourceMod: "Create Mod",
    recipes: [
      {
        id: "recipe-deploying-train-casing",
        name: "Deployer (from Brass Casing)",
        method: "Manual Application",
        buildingRequired: "Deployer",
        processingTimeSeconds: 1,
        ingredients: [
          { itemId: "brass-casing", itemName: "Brass Casing", amount: 1 },
          { itemId: "sturdy-sheet", itemName: "Sturdy Sheet", amount: 1 }
        ],
        outputs: [{ itemId: "train-casing", itemName: "Train Casing", amount: 1 }],
        sourceMod: "Create Mod"
      }
    ]
  }
];
