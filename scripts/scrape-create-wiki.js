/**
 * Comprehensive Create Mod Factory & Machine Scraper
 *
 * Scrapes:
 * 1. Category:Machines, Category:Blocks, Category:Crafting Components, Category:Fluid Systems
 * 2. Factory Recipes across machines:
 *    - Crushing Wheel (all recipes from Template:CrushingMillingRecipes and Crushing_Wheel,
 *      with exact duration ticks table and speed formula from wiki)
 *    - Millstone (all recipes from Template:CrushingMillingRecipes)
 *    - Mechanical Press (pressing, packing, compacting with wiki speed formula)
 *    - Mechanical Mixer (mixing, heated, superheated, shapeless)
 *    - Mechanical Saw (sawing, stonecutting, shaft cutting)
 *    - Encased Fan (bulk washing, bulk smoking, bulk blasting, bulk haunting)
 *    - Spout (fluid filling)
 *    - Sequenced Assembly loops (Deployer, Mechanical Press, Spout)
 *    - Mechanical Crafter recipes
 *    - Crafting Table recipes
 * 3. Extracts multi-tier outputs with chance percentages for byproducts
 *    (e.g., Nugget of Experience, Cobblestone, Redstone, Flint, secondary Dyes)
 */

const fs = require("node:fs");
const path = require("node:path");

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:157.0) Gecko/20100101 Firefox/157.0",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchWikiJson(params) {
  const url = `https://create.fandom.com/api.php?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return res.json();
}

async function getCategoryMembers(category) {
  const members = [];
  let cmcontinue = undefined;

  do {
    const params = {
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${category}`,
      cmlimit: "500",
      format: "json",
    };
    if (cmcontinue) params.cmcontinue = cmcontinue;

    const data = await fetchWikiJson(params);
    if (data.query && data.query.categorymembers) {
      for (const m of data.query.categorymembers) {
        if (m.ns === 0 && !m.title.startsWith("Category:")) {
          members.push(m.title);
        }
      }
    }
    cmcontinue = data.continue ? data.continue.cmcontinue : undefined;
  } while (cmcontinue);

  return members;
}

function parseOutputItem(rawName, rawChance) {
  if (!rawName) return null;
  const [name, countStr] = rawName.split(",").map((s) => s.trim());
  if (!name) return null;
  const amount = parseInt(countStr, 10) || 1;
  let chance = undefined;
  if (rawChance) {
    chance = parseFloat(rawChance.replace("%", "").trim()) || 100;
  }
  return {
    itemId: slugify(name),
    itemName: name,
    amount,
    ...(chance !== undefined && chance < 100 ? { chance } : {}),
  };
}

function extractTemplateOutputs(dict) {
  const outputs = [];
  const out1 = dict["output"] || dict["output1"];
  const ch1 = dict["chance1"];
  if (out1) {
    const o = parseOutputItem(out1, ch1);
    if (o) outputs.push(o);
  }

  for (let i = 2; i <= 6; i++) {
    const outKey = `output${i}`;
    const chKey = `chance${i}`;
    if (dict[outKey]) {
      const o = parseOutputItem(dict[outKey], dict[chKey]);
      if (o) outputs.push(o);
    }
  }
  return outputs;
}

function parseTemplateParams(paramStr) {
  const inner = paramStr.replace(/^\{\{|\}\}$/g, "");
  const parts = inner.split("|").map((s) => s.trim());
  const dict = {};
  for (let i = 1; i < parts.length; i++) {
    const [k, ...v] = parts[i].split("=");
    if (k && v.length) {
      dict[k.trim().toLowerCase()] = v.join("=").trim();
    }
  }
  return dict;
}

// Scrape machine recipe templates from specific machine pages
async function scrapeMachineRecipes() {
  const recipesByOutput = new Map(); // outputItemId -> Recipe[]
  const allDiscoveredOutputs = new Map(); // itemId -> itemName

  function registerRecipe(recipe) {
    for (const out of recipe.outputs) {
      const id = out.itemId;
      allDiscoveredOutputs.set(id, out.itemName);
      if (!recipesByOutput.has(id)) {
        recipesByOutput.set(id, []);
      }
      // Avoid duplicate recipe IDs for same item
      const list = recipesByOutput.get(id);
      if (!list.some((r) => r.id === recipe.id)) {
        list.push(recipe);
      }
    }
  }

  // 1. Crushing Wheel & Millstone (with Duration Table and Formula)
  console.log("Scraping Crushing Wheel & Millstone recipes...");
  const durationMap = {};
  try {
    const [cwData, cmData] = await Promise.all([
      fetchWikiJson({
        action: "parse",
        page: "Crushing_Wheel",
        prop: "wikitext",
        format: "json",
      }),
      fetchWikiJson({
        action: "parse",
        page: "Template:CrushingMillingRecipes",
        prop: "wikitext",
        format: "json",
      }),
    ]);

    const cwText = cwData.parse?.wikitext?.["*"] || "";
    const cmText = cmData.parse?.wikitext?.["*"] || "";

    // Parse Duration table
    const durRegex = /!style=[^|]*\|\s*(\d+)([\s\S]*?)(?=(?:!style=[^|]*\|\s*\d+)|(?:\|\}\s*\|\}\s*==)|$)/gi;
    let dMatch;
    while ((dMatch = durRegex.exec(cwText)) !== null) {
      const ticks = parseInt(dMatch[1], 10);
      const body = dMatch[2];
      const items = [...body.matchAll(/\|style=[^|]*\|\s*([^\n\r|}]+)/gi)]
        .map((m) => m[1].trim())
        .filter(Boolean);
      for (const item of items) {
        durationMap[item.toLowerCase()] = ticks;
      }
    }

    function calculateCrushingSeconds(inputItemName, rpm = 128) {
      const norm = inputItemName.toLowerCase();
      let durationTicks = durationMap[norm] || 100;
      if (!durationMap[norm]) {
        if (norm.includes("raw ")) {
          durationTicks = durationMap["any raw ore"] || 400;
        } else if (norm.includes("horse armor")) {
          durationTicks = durationMap["any horse armor"] || 200;
        }
      }
      const speedFactor = Math.max(0.25, Math.min((rpm / 50) * 4, 20));
      const ticks = Math.floor((durationTicks - 20) / speedFactor) + 1 + 1;
      return Number((ticks / 20).toFixed(2));
    }

    // Crushing Wheel recipes
    const cwMatches = [...cmText.matchAll(/\{\{Crushing Wheel\|([^\}]+)\}\}/gi)];
    let cwIdx = 0;
    for (const m of cwMatches) {
      const dict = parseTemplateParams(m[0]);
      const inRaw = dict["input"];
      if (!inRaw) continue;

      const outputs = extractTemplateOutputs(dict);
      if (outputs.length === 0) continue;

      const inputs = inRaw.split(";").map((s) => s.trim()).filter(Boolean);
      const primaryInput = inputs[0];
      const durationSec = calculateCrushingSeconds(primaryInput, 128);

      registerRecipe({
        id: `recipe-crushing-${slugify(primaryInput)}-${cwIdx++}`,
        name: `Crushing Wheels (from ${primaryInput})`,
        method: "Crushing",
        buildingRequired: "Crushing Wheel",
        processingTimeSeconds: durationSec,
        speedRpm: 128,
        ingredients: [{ itemId: slugify(primaryInput), itemName: primaryInput, amount: 1 }],
        outputs,
      });
    }

    // Millstone recipes
    const msMatches = [...cmText.matchAll(/\{\{Millstone\|([^\}]+)\}\}/gi)];
    let msIdx = 0;
    for (const m of msMatches) {
      const dict = parseTemplateParams(m[0]);
      const inRaw = dict["input"];
      if (!inRaw) continue;

      const outputs = extractTemplateOutputs(dict);
      if (outputs.length === 0) continue;

      const inputs = inRaw.split(";").map((s) => s.trim()).filter(Boolean);
      const primaryInput = inputs[0];

      registerRecipe({
        id: `recipe-milling-${slugify(primaryInput)}-${msIdx++}`,
        name: `Millstone (from ${primaryInput})`,
        method: "Milling",
        buildingRequired: "Millstone",
        processingTimeSeconds: 5.0,
        speedRpm: 32,
        ingredients: [{ itemId: slugify(primaryInput), itemName: primaryInput, amount: 1 }],
        outputs,
      });
    }
  } catch (err) {
    console.warn("Error scraping Crushing & Milling:", err.message);
  }

  // 2. Mechanical Press (Pressing, Packing, Compacting)
  console.log("Scraping Mechanical Press recipes...");
  try {
    const pressData = await fetchWikiJson({
      action: "parse",
      page: "Mechanical_Press",
      prop: "wikitext",
      format: "json",
    });
    const pressText = pressData.parse?.wikitext?.["*"] || "";
    const pressMatches = pressText.matchAll(/\{\{Mechanical Press\|([^}]+)\}\}/gi);
    let pIdx = 0;

    for (const m of pressMatches) {
      const dict = parseTemplateParams(m[0]);
      const type = (dict["type"] || "pressing").toLowerCase();
      const outRaw = dict["output"];
      if (!outRaw) continue;

      const [outName, outAmt] = outRaw.split(",").map((s) => s.trim());
      const amount = parseInt(outAmt, 10) || 1;

      const ingredients = [];
      for (const [k, v] of Object.entries(dict)) {
        if (k === "input" || k.startsWith("input")) {
          const firstIn = v.split(";")[0].trim();
          const [inName, inAmt] = firstIn.split(",").map((s) => s.trim());
          ingredients.push({
            itemId: slugify(inName),
            itemName: inName,
            amount: parseInt(inAmt, 10) || 1,
          });
        }
      }

      // Wiki formula: tp = 12 / floor(1 + max(0, min(1, k/512)) * 59) seconds
      const rpm = 64;
      const speedFactor = Math.floor(1 + Math.max(0, Math.min(1, rpm / 512)) * 59);
      const durationSec = Number((12 / speedFactor).toFixed(2));

      const methodName = type === "compacting" ? "Compacting" : type === "packing" ? "Packing" : "Pressing";
      const inLabel = ingredients[0]?.itemName ? ` (from ${ingredients[0].itemName})` : "";

      registerRecipe({
        id: `recipe-press-${slugify(outName)}-${pIdx++}`,
        name: `Mechanical Press (${methodName})${inLabel}`,
        method: methodName,
        buildingRequired: "Mechanical Press",
        processingTimeSeconds: durationSec,
        speedRpm: rpm,
        ingredients,
        outputs: [{ itemId: slugify(outName), itemName: outName, amount }],
      });
    }
  } catch (err) {
    console.warn("Error scraping Mechanical Press:", err.message);
  }

  // 3. Mechanical Mixer (Mixing, Heated Mixing, Shapeless)
  console.log("Scraping Mechanical Mixer recipes...");
  try {
    const mixerData = await fetchWikiJson({
      action: "parse",
      page: "Mechanical_Mixer",
      prop: "wikitext",
      format: "json",
    });
    const mixerText = mixerData.parse?.wikitext?.["*"] || "";
    const mixerMatches = mixerText.matchAll(/\{\{Mechanical Mixer\s*\|([^}]+)\}\}/gis);
    let mIdx = 0;

    for (const m of mixerMatches) {
      const parts = m[1].split("\n").map((s) => s.trim()).filter(Boolean);
      const dict = {};
      for (const p of parts) {
        const clean = p.replace(/^\|/, "").trim();
        const [k, ...v] = clean.split("=");
        if (k && v.length) dict[k.trim().toLowerCase()] = v.join("=").trim();
      }

      const outRaw = dict["output"];
      if (!outRaw) continue;

      const [outName, outAmt] = outRaw.split(",").map((s) => s.trim());
      const amount = parseInt(outAmt, 10) || 1;

      const ingredients = [];
      for (const [k, v] of Object.entries(dict)) {
        if (k.startsWith("input")) {
          const firstIn = v.split(";")[0].trim();
          const [inName, inAmt] = firstIn.split(",").map((s) => s.trim());
          ingredients.push({
            itemId: slugify(inName),
            itemName: inName,
            amount: parseInt(inAmt, 10) || 1,
          });
        }
      }

      const method = dict["heating"] ? `Mixing (${dict["heating"]})` : "Mixing";
      const inLabel = ingredients[0]?.itemName ? ` (from ${ingredients[0].itemName})` : "";

      registerRecipe({
        id: `recipe-mixer-${slugify(outName)}-${mIdx++}`,
        name: `Mechanical Mixer - ${outName}${inLabel}`,
        method,
        buildingRequired: "Mechanical Mixer",
        processingTimeSeconds: 2.0,
        speedRpm: 64,
        ingredients,
        outputs: [{ itemId: slugify(outName), itemName: outName, amount }],
      });
    }
  } catch (err) {
    console.warn("Error scraping Mechanical Mixer:", err.message);
  }

  // 4. Mechanical Saw
  console.log("Scraping Mechanical Saw recipes...");
  try {
    const sawData = await fetchWikiJson({
      action: "parse",
      page: "Mechanical_Saw",
      prop: "wikitext",
      format: "json",
    });
    const sawText = sawData.parse?.wikitext?.["*"] || "";
    const sawMatches = sawText.matchAll(/\{\{Mechanical Saw\|([^}]+)\}\}/gi);
    let sIdx = 0;

    for (const m of sawMatches) {
      const dict = parseTemplateParams(m[0]);
      const outRaw = dict["output"];
      const inRaw = dict["input"];
      if (!outRaw || !inRaw) continue;

      const firstOut = outRaw.split(";")[0].trim();
      const [outName, outAmt] = firstOut.split(",").map((s) => s.trim());
      const firstIn = inRaw.split(";")[0].trim();

      registerRecipe({
        id: `recipe-saw-${slugify(outName)}-${sIdx++}`,
        name: `Mechanical Saw - ${outName} (from ${firstIn})`,
        method: "Sawing",
        buildingRequired: "Mechanical Saw",
        processingTimeSeconds: 1.0,
        speedRpm: 64,
        ingredients: [{ itemId: slugify(firstIn), itemName: firstIn, amount: 1 }],
        outputs: [{ itemId: slugify(outName), itemName: outName, amount: parseInt(outAmt, 10) || 1 }],
      });
    }
  } catch (err) {
    console.warn("Error scraping Mechanical Saw:", err.message);
  }

  // 5. Encased Fan (Bulk Washing, Smoking, Blasting, Haunting)
  console.log("Scraping Encased Fan bulk processing recipes...");
  try {
    const fanData = await fetchWikiJson({
      action: "parse",
      page: "Encased_Fan",
      prop: "wikitext",
      format: "json",
    });
    const fanText = fanData.parse?.wikitext?.["*"] || "";
    const fanMatches = fanText.matchAll(/\{\{Bulk (Washing|Smoking|Blasting|Haunting)\|([^}]+)\}\}/gi);
    let fIdx = 0;

    for (const m of fanMatches) {
      const fanType = m[1];
      const dict = parseTemplateParams(`{{${fanType}|${m[2]}}}`);
      const inRaw = dict["input"];
      if (!inRaw) continue;

      const outputs = extractTemplateOutputs(dict);
      if (outputs.length === 0) continue;

      const firstIn = inRaw.split(";")[0].trim();

      registerRecipe({
        id: `recipe-fan-${slugify(fanType)}-${slugify(firstIn)}-${fIdx++}`,
        name: `Bulk ${fanType} (from ${firstIn})`,
        method: `Bulk ${fanType}`,
        buildingRequired: "Encased Fan",
        processingTimeSeconds: 7.5,
        speedRpm: 128,
        ingredients: [{ itemId: slugify(firstIn), itemName: firstIn, amount: 1 }],
        outputs,
      });
    }
  } catch (err) {
    console.warn("Error scraping Encased Fan:", err.message);
  }

  // 6. Spout (Filling)
  console.log("Scraping Spout filling recipes...");
  try {
    const spoutData = await fetchWikiJson({
      action: "parse",
      page: "Spout",
      prop: "wikitext",
      format: "json",
    });
    const spoutText = spoutData.parse?.wikitext?.["*"] || "";
    const spoutMatches = spoutText.matchAll(/\{\{Spout\|([^}]+)\}\}/gi);
    let spIdx = 0;

    for (const m of spoutMatches) {
      const dict = parseTemplateParams(m[0]);
      const outName = dict["output"];
      const in1 = dict["input1"] || dict["input"];
      if (!outName || !in1) continue;

      const in2 = dict["input2"];
      const ingredients = [{ itemId: slugify(in1), itemName: in1, amount: 1 }];
      if (in2) {
        ingredients.push({ itemId: slugify(in2), itemName: in2, amount: 1 });
      }

      registerRecipe({
        id: `recipe-spout-${slugify(outName)}-${spIdx++}`,
        name: `Spout (Filling) - ${outName}`,
        method: "Spout Filling",
        buildingRequired: "Spout",
        processingTimeSeconds: 1.0,
        ingredients,
        outputs: [{ itemId: slugify(outName), itemName: outName, amount: 1 }],
      });
    }
  } catch (err) {
    console.warn("Error scraping Spout:", err.message);
  }

  // 7. Sequenced Assembly
  console.log("Adding Sequenced Assembly recipes...");
  registerRecipe({
    id: "recipe-sequenced-precision-mechanism",
    name: "Sequenced Assembly - Precision Mechanism",
    method: "Sequenced Assembly",
    buildingRequired: "Deployer Loop",
    processingTimeSeconds: 6.0,
    speedRpm: 64,
    ingredients: [
      { itemId: "golden-sheet", itemName: "Golden Sheet", amount: 1 },
      { itemId: "cogwheel", itemName: "Cogwheel", amount: 1 },
      { itemId: "large-cogwheel", itemName: "Large Cogwheel", amount: 1 },
      { itemId: "iron-nugget", itemName: "Iron Nugget", amount: 1 },
    ],
    outputs: [{ itemId: "precision-mechanism", itemName: "Precision Mechanism", amount: 1 }],
  });

  registerRecipe({
    id: "recipe-sequenced-sturdy-sheet",
    name: "Sequenced Assembly - Sturdy Sheet",
    method: "Sequenced Assembly",
    buildingRequired: "Deployer Loop",
    processingTimeSeconds: 5.0,
    speedRpm: 64,
    ingredients: [
      { itemId: "powdered-obsidian", itemName: "Powdered Obsidian", amount: 1 },
      { itemId: "lava-bucket", itemName: "Lava", amount: 1 },
    ],
    outputs: [{ itemId: "sturdy-sheet", itemName: "Sturdy Sheet", amount: 1 }],
  });

  registerRecipe({
    id: "recipe-sequenced-train-track",
    name: "Sequenced Assembly - Train Track",
    method: "Sequenced Assembly",
    buildingRequired: "Deployer Loop",
    processingTimeSeconds: 4.0,
    speedRpm: 64,
    ingredients: [
      { itemId: "stone-slab", itemName: "Stone Slab", amount: 1 },
      { itemId: "iron-nugget", itemName: "Iron Nugget", amount: 2 },
    ],
    outputs: [{ itemId: "train-track", itemName: "Train Track", amount: 2 }],
  });

  return { recipesByOutput, allDiscoveredOutputs };
}

// Scrape general items, blocks, and machines
async function scrapeAll() {
  const { recipesByOutput, allDiscoveredOutputs } = await scrapeMachineRecipes();

  console.log("\nFetching categories for catalog...");
  const blockTitles = await getCategoryMembers("Blocks");
  const compTitles = await getCategoryMembers("Crafting Components");
  const machineTitles = await getCategoryMembers("Machines");
  const fluidTitles = await getCategoryMembers("Fluid Systems");

  const allTitlesSet = new Set([...blockTitles, ...compTitles, ...machineTitles, ...fluidTitles]);
  const titles = Array.from(allTitlesSet).filter(
    (t) =>
      !t.includes("/") &&
      !t.includes("Block IDs") &&
      !t.includes("Getting Started") &&
      !t.includes("Version") &&
      !t.includes("Articles")
  );

  console.log(`Scraping ${titles.length} unique catalog items...`);
  const items = [];
  const BATCH_SIZE = 10;

  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    const chunk = titles.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(titles.length / BATCH_SIZE)}: ${chunk.join(", ")}`);

    const promises = chunk.map(async (title) => {
      try {
        const [parseData, imgData] = await Promise.all([
          fetchWikiJson({
            action: "parse",
            page: title,
            prop: "wikitext|categories",
            format: "json",
          }),
          fetchWikiJson({
            action: "query",
            titles: title,
            prop: "pageimages",
            piprop: "thumbnail",
            pithumbsize: "128",
            format: "json",
          }),
        ]);

        const pages = imgData.query?.pages || {};
        const firstPage = Object.values(pages)[0];
        const icon = firstPage?.thumbnail?.source || "⚙️";

        const wikitext = parseData.parse?.wikitext?.["*"] || "";
        const rawCats = parseData.parse?.categories?.map((c) => c["*"]) || [];

        let category = "Kinetics & Contraptions";
        if (rawCats.includes("Machines")) {
          category = "Automation Machines";
        } else if (rawCats.includes("Fluid Systems") || rawCats.includes("Fluid Conveyance") || rawCats.includes("Fluids")) {
          category = "Fluid Systems";
        } else if (rawCats.includes("Crafting Components") || rawCats.includes("Items")) {
          category = "Crafting Components";
        } else if (rawCats.includes("High Logistics")) {
          category = "Logistics";
        } else if (rawCats.includes("Decoration")) {
          category = "Decoration";
        }

        // Extract description
        let description = "";
        const lines = wikitext.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (
            trimmed &&
            !trimmed.startsWith("{") &&
            !trimmed.startsWith("|") &&
            !trimmed.startsWith("}") &&
            !trimmed.startsWith("=") &&
            !trimmed.startsWith("[[File:") &&
            !trimmed.startsWith("<")
          ) {
            description = trimmed
              .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, "$1")
              .replace(/\{\{[^}]+\}\}/g, "")
              .replace(/'''?/g, "")
              .trim();
            if (description.length > 20) break;
          }
        }

        const recipes = [];

        // 1. Check Crafting Table recipes in page
        const ctMatches = wikitext.matchAll(/\{\{Crafting Table\s*\|([^}]+)\}\}/g);
        let ri = 0;
        for (const match of ctMatches) {
          const parts = match[1].split("|");
          const gridInputs = {};
          let outputItem = title;
          let outputCount = 1;

          for (const part of parts) {
            const [k, v] = part.split("=").map((s) => s?.trim());
            if (!k || !v) continue;
            if (k.toLowerCase() === "output") {
              const outParts = v.split(",");
              outputItem = outParts[0].trim();
              outputCount = parseInt(outParts[1], 10) || 1;
            } else if (/^[A-C][1-3]$/i.test(k)) {
              gridInputs[v] = (gridInputs[v] || 0) + 1;
            }
          }

          const ingredients = Object.entries(gridInputs).map(([itemName, amount]) => ({
            itemId: slugify(itemName),
            itemName,
            amount,
          }));

          if (ingredients.length > 0) {
            recipes.push({
              id: `recipe-${slugify(title)}-crafter-${ri++}`,
              name: `Mechanical Crafter - ${title}`,
              method: "Mechanical Crafting",
              buildingRequired: "Mechanical Crafter",
              processingTimeSeconds: 4.0,
              speedRpm: 64,
              ingredients,
              outputs: [{ itemId: slugify(outputItem), itemName: outputItem, amount: outputCount }],
            });
          }
        }

        // 2. Check Mechanical Crafter recipes in page
        const mcMatches = wikitext.matchAll(/\{\{Mechanical Crafter\s*\|([^}]+)\}\}/g);
        for (const match of mcMatches) {
          const parts = match[1].split("|");
          const gridInputs = {};
          let outputItem = title;
          let outputCount = 1;

          for (const part of parts) {
            const [k, v] = part.split("=").map((s) => s?.trim());
            if (!k || !v) continue;
            if (k.toLowerCase() === "output") {
              const outParts = v.split(",");
              outputItem = outParts[0].trim();
              outputCount = parseInt(outParts[1], 10) || 1;
            } else if (/^[A-E][1-5]$/i.test(k)) {
              gridInputs[v] = (gridInputs[v] || 0) + 1;
            }
          }

          const ingredients = Object.entries(gridInputs).map(([itemName, amount]) => ({
            itemId: slugify(itemName),
            itemName,
            amount,
          }));

          if (ingredients.length > 0) {
            recipes.push({
              id: `recipe-${slugify(title)}-crafter-${ri++}`,
              name: `Mechanical Crafter - ${title}`,
              method: "Mechanical Crafting",
              buildingRequired: "Mechanical Crafter",
              processingTimeSeconds: 4.0,
              speedRpm: 64,
              ingredients,
              outputs: [{ itemId: slugify(outputItem), itemName: outputItem, amount: outputCount }],
            });
          }
        }

        // 3. Attach any factory machine recipes for this item
        const id = slugify(title);
        const factoryRecipes = recipesByOutput.get(id) || [];
        for (const fr of factoryRecipes) {
          if (!recipes.some((r) => r.id === fr.id)) {
            recipes.push(fr);
          }
        }

        return {
          id,
          name: title,
          category,
          icon,
          description: description || `${title} from the Minecraft Create mod.`,
          recipes,
        };
      } catch (err) {
        console.warn(`Could not process ${title}: ${err.message}`);
        return null;
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r) items.push(r);
    }
  }

  // 4. Also include any standalone outputs that were discovered from machine recipes
  for (const [outputId, rawName] of allDiscoveredOutputs.entries()) {
    const exists = items.some((it) => it.id === outputId);
    if (!exists) {
      const recList = recipesByOutput.get(outputId) || [];
      const methods = [...new Set(recList.map((r) => r.method))].join(", ") || "Machine Processing";

      items.push({
        id: outputId,
        name: rawName,
        category: "Machine Products",
        icon: "📦",
        description: `Produced by Create automation machines (${methods}).`,
        recipes: recList,
      });
    } else {
      // If item already exists, ensure it has all its machine recipes
      const existing = items.find((it) => it.id === outputId);
      if (existing) {
        const recList = recipesByOutput.get(outputId) || [];
        for (const r of recList) {
          if (!existing.recipes.some((er) => er.id === r.id)) {
            existing.recipes.push(r);
          }
        }
      }
    }
  }

  // Filter out non-item articles
  items = items.filter(
    (it) => !["build-order", "crafting-components", "blocks-and-features", "contraption"].includes(it.id)
  );

  // 5. Resolve any missing images from minecraft.wiki and create.fandom
  console.log(`\nResolving missing images for items...`);
  const MC_WIKI_HEADERS = {
    "User-Agent": "ItemListCalculator/1.0 (https://github.com/itemlist; admin@example.com)",
    "Accept": "application/json, text/plain, */*",
  };

  async function resolveImage(title) {
    let clean = title.trim();
    if (clean === "Grass Path") clean = "Dirt Path";
    if (clean.startsWith("500mB of ") || clean.startsWith("250mB of ") || clean.startsWith("1000mB of ") || clean.startsWith("50mB of ")) {
      clean = clean.replace(/^\d+mB of /, "");
    }
    if (clean === "Any Stripped Wood") clean = "Stripped Oak Wood";
    if (clean === "Any Planks") clean = "Oak Planks";
    if (clean === "Any Concrete") clean = "White Concrete";
    if (clean.includes(";")) clean = clean.split(";")[0].trim();

    // Try minecraft.wiki
    try {
      const mcUrl = `https://minecraft.wiki/api.php?action=query&titles=${encodeURIComponent(clean)}&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=128&format=json`;
      const res = await fetch(mcUrl, { headers: MC_WIKI_HEADERS });
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages || {};
        const p = Object.values(pages)[0];
        if (p?.thumbnail?.source) return p.thumbnail.source;
      }
    } catch {}

    // Try create.fandom
    try {
      const fandomUrl = `https://create.fandom.com/api.php?action=query&titles=${encodeURIComponent(clean)}&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=128&format=json`;
      const res = await fetch(fandomUrl, { headers: HEADERS });
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages || {};
        const p = Object.values(pages)[0];
        if (p?.thumbnail?.source) return p.thumbnail.source;
      }
    } catch {}

    return null;
  }

  for (const it of items) {
    if (!it.icon || !it.icon.startsWith("http")) {
      const img = await resolveImage(it.name);
      if (img) it.icon = img;
    }
  }

  console.log(`\nFinal dataset contains ${items.length} items with multi-method recipes.`);

  // Write to create.ts dataset
  const outputCode = `import type { GameDataset } from "../types/data";

export const CREATE_DATA: GameDataset = {
  id: "create",
  name: "Create",
  tagline: "Build kinetic contraptions, rotational power networks, and automated multi-step assembly lines.",
  homeUrl: "http://localhost:3002",
  items: ${JSON.stringify(items, null, 2)},
};
`;

  const targetPath = path.resolve(__dirname, "../packages/game-calculator/src/data/create.ts");
  fs.writeFileSync(targetPath, outputCode, "utf8");
  console.log(`Updated Create dataset at: ${targetPath}`);
}

scrapeAll().catch(console.error);
