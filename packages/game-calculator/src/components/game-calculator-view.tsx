"use client";

import React, { useState, useMemo, useCallback } from "react";
import type { GameDataset, GameItem, Recipe } from "../types/data";
import type { ProductionRequest } from "../types/graph";
import { calculateRecipeGraph } from "../lib/graph-builder";
import { RecipeGraphView } from "./graph/recipe-graph";
import { ItemDetailPopup } from "./item-detail-popup";
import { RecipeChooserModal } from "./recipe-chooser-modal";
import { ReportIssueModal } from "./report-issue-modal";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Layers,
  Network,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  Info,
  X,
  Cpu,
  Home,
  ArrowLeft,
  AlertTriangle,
  Flag,
} from "lucide-react";
import { isAppUnderDevelopment } from "@repo/app-config";

interface GameCalculatorViewProps {
  dataset: GameDataset;
}

export function GameCalculatorView({ dataset }: GameCalculatorViewProps) {
  const [search, setSearch] = useState("");
  const [detailItem, setDetailItem] = useState<GameItem | null>(null);

  // Recipe chooser modal state
  const [chooserItem, setChooserItem] = useState<GameItem | null>(null);

  // Report issue modal state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportItem, setReportItem] = useState<GameItem | null>(null);

  // Layout states: Collapsible planner drawer & collapsible catalog sidebar
  const [isPlannerOpen, setIsPlannerOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Production planner targets
  const [requests, setRequests] = useState<ProductionRequest[]>([]);

  // Intermediate recipe overrides for graph calculation: itemId -> recipeId
  const [recipeOverrides, setRecipeOverrides] = useState<Record<string, string>>({});

  // Intermediate ingredient choice overrides: groupKey/itemId -> chosenCandidateOptionId
  const [ingredientChoices, setIngredientChoices] = useState<Record<string, string>>({});

  const handleSwitchIngredient = useCallback((groupKey: string, chosenOptionId: string) => {
    setIngredientChoices((prev) => ({
      ...prev,
      [groupKey]: chosenOptionId,
    }));
  }, []);

  // Filtered and grouped items by category
  const categorizedItems = useMemo(() => {
    const query = search.toLowerCase().trim();
    const groups: { category: string; items: GameItem[] }[] = [];
    const map = new Map<string, GameItem[]>();

    for (const item of dataset.items) {
      const match =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      if (match) {
        const cat = item.category || "General";
        if (!map.has(cat)) {
          map.set(cat, []);
        }
        map.get(cat)!.push(item);
      }
    }

    const sortedCats = Array.from(map.keys()).sort();
    for (const cat of sortedCats) {
      groups.push({ category: cat, items: map.get(cat)! });
    }
    return groups;
  }, [dataset.items, search]);

  const totalFilteredCount = useMemo(() => {
    return categorizedItems.reduce((sum, g) => sum + g.items.length, 0);
  }, [categorizedItems]);

  // Map of active request quantities by itemId for quick lookup in sidebar
  const requestQuantities = useMemo(() => {
    const map = new Map<string, number>();
    for (const req of requests) {
      map.set(req.itemId, req.targetQuantityPerMinute);
    }
    return map;
  }, [requests]);

  // Direct add/increment target without modal
  const addTargetDirectly = useCallback((item: GameItem, recipeId?: string) => {
    setRequests((prev) => {
      const existing = prev.find((r) => r.itemId === item.id);
      if (existing) {
        return prev.map((r) =>
          r.itemId === item.id
            ? {
                ...r,
                targetQuantityPerMinute: r.targetQuantityPerMinute + 10,
                recipeId: recipeId || r.recipeId,
              }
            : r
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          targetQuantityPerMinute: 60,
          recipeId: recipeId || item.recipes?.[0]?.id,
        },
      ];
    });
  }, []);

  // When clicking an item: if it has multiple recipes, open the chooser popup!
  const handleItemClick = useCallback((item: GameItem) => {
    const availableRecipes = item.recipes || (item.recipe ? [item.recipe] : []);
    if (availableRecipes.length > 1) {
      setChooserItem(item);
    } else {
      addTargetDirectly(item);
    }
  }, [addTargetDirectly]);

  // When selecting a recipe from the chooser modal
  const handleSelectRecipe = useCallback((recipe: Recipe) => {
    if (!chooserItem) return;
    const item = chooserItem;

    // Check if item is already in requests
    const isTarget = requests.some((r) => r.itemId === item.id);
    if (isTarget) {
      setRequests((prev) =>
        prev.map((r) =>
          r.itemId === item.id ? { ...r, recipeId: recipe.id } : r
        )
      );
    } else {
      // Add it to targets with the selected recipe
      addTargetDirectly(item, recipe.id);
    }

    // Also record in recipeOverrides so intermediate crafting in the graph respects it
    setRecipeOverrides((prev) => ({
      ...prev,
      [item.id]: recipe.id,
    }));
  }, [chooserItem, requests, addTargetDirectly]);

  const handleRemoveRequest = useCallback((itemId: string) => {
    setRequests((prev) => prev.filter((r) => r.itemId !== itemId));
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, qty: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.itemId === itemId ? { ...r, targetQuantityPerMinute: Math.max(0, qty) } : r
      )
    );
  }, []);

  // Compute graph calculation with recipeOverrides and ingredientChoices
  const graphCalculation = useMemo(() => {
    return calculateRecipeGraph(dataset.items, requests, recipeOverrides, ingredientChoices);
  }, [dataset.items, requests, recipeOverrides, ingredientChoices]);

  const totalMachineCount = useMemo(() => {
    return Object.values(graphCalculation.totalBuildings).reduce((sum, count) => sum + count, 0);
  }, [graphCalculation.totalBuildings]);

  const homeUrl = dataset.homeUrl || "/";

  const underDev = isAppUnderDevelopment(dataset.id);

  return (
    <div className="flex flex-col h-full min-h-0 flex-1 w-full overflow-hidden p-2 sm:p-3 gap-2">
      {/* 1. Control Bar / Navbar - with Yellow/Red Stripes if Under Development */}
      <div
        className={`flex items-center justify-between shrink-0 text-xs rounded-lg transition-all ${
          underDev
            ? "py-1.5 px-3 border border-red-700/80 shadow-md"
            : "pb-1"
        }`}
        style={
          underDev
            ? {
                background:
                  "repeating-linear-gradient(45deg, #eab308, #eab308 16px, #dc2626 16px, #dc2626 32px)",
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={homeUrl}
            className={`flex items-center gap-1.5 text-xs font-medium rounded-md px-2.5 py-1 shrink-0 transition-colors ${
              underDev
                ? "bg-black/80 text-white hover:bg-black/90 shadow"
                : "text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
            title="Return to Home Directory"
          >
            <ArrowLeft className="h-3 w-3" />
            <Home className="h-3 w-3" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className={`h-3.5 w-px shrink-0 ${underDev ? "bg-black/40" : "bg-zinc-800/80"}`} />
          <div
            className={`flex items-center gap-2 min-w-0 ${
              underDev ? "bg-black/85 px-3 py-1 rounded-md shadow" : ""
            }`}
          >
            <span
              className={`font-semibold truncate ${
                underDev ? "text-white font-bold" : "text-zinc-200"
              }`}
            >
              {dataset.name} Calculator
            </span>
            <span
              className={`text-[10px] font-mono hidden md:inline ${
                underDev ? "text-zinc-300" : "text-zinc-500"
              }`}
            >
              ({dataset.items.length} items)
            </span>

            {underDev && (
              <span className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-yellow-400 text-black border border-black/40 shadow">
                <AlertTriangle className="h-3.5 w-3.5 fill-black stroke-yellow-400" />
                Under Development
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setReportItem(null);
              setIsReportOpen(true);
            }}
            className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 font-medium ${
              underDev
                ? "bg-black/85 text-zinc-200 hover:text-white hover:bg-black border border-white/10 shadow"
                : "text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06]"
            }`}
            title="Report recipe error, wrong throughput, or missing data"
          >
            <Flag className="h-3 w-3 text-red-400" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>

          {requests.length > 0 && (
            <button
              type="button"
              onClick={() => setRequests([])}
              className={`text-[11px] px-2 py-0.5 transition-colors cursor-pointer rounded ${
                underDev
                  ? "bg-black/80 text-zinc-300 hover:text-red-400 shadow"
                  : "text-zinc-500 hover:text-red-400"
              }`}
            >
              Clear Targets
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsPlannerOpen((prev) => !prev)}
            className={`text-[11px] px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
              underDev
                ? "bg-black/80 text-white hover:bg-black/95 shadow"
                : "text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07]"
            }`}
          >
            <span>{isPlannerOpen ? "Collapse Targets" : "Expand Targets"}</span>
            {isPlannerOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>


      {/* 2. Main Workspace: Left Collapsible JEI Sidebar + Right Graph Canvas on Same Page */}
      <div className="flex flex-col lg:flex-row gap-3 w-full flex-1 min-h-0 h-full overflow-hidden">
        {/* Left Collapsible Item Catalog (JEI / REI Style) */}
        {isSidebarOpen ? (
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-2 p-1 h-full min-h-0 overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Catalog</h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  ({totalFilteredCount})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.08] py-1 pl-8 pr-7 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1.5 text-zinc-500 hover:text-zinc-300 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Items Grid Grouped by Category with Separators */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-3">
              {categorizedItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No items match &quot;{search}&quot;.
                </div>
              ) : (
                categorizedItems.map((group) => (
                  <div key={group.category} className="flex flex-col gap-1.5">
                    {/* Category Separator Header */}
                    <div className="flex items-center gap-2 pt-1 pb-0.5 sticky top-0 bg-[#09090b]/95 backdrop-blur-sm z-10">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                        {group.category}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        ({group.items.length})
                      </span>
                      <div className="flex-1 h-px bg-zinc-800/80" />
                    </div>

                    {/* Category Items Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-1.5">
                      {group.items.map((item) => {
                        const isImageUrl =
                          item.icon &&
                          (item.icon.startsWith("/") ||
                            item.icon.startsWith("http") ||
                            item.icon.endsWith(".png") ||
                            item.icon.endsWith(".webp"));
                        const plannedQty = requestQuantities.get(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setDetailItem(item);
                            }}
                            className={`group relative flex flex-col items-center justify-between rounded-md p-1.5 transition-all cursor-pointer select-none min-h-[58px] ${
                              plannedQty !== undefined
                                ? "bg-indigo-500/20 ring-1 ring-indigo-500/60"
                                : "hover:bg-white/[0.08]"
                            }`}
                            title={`${item.name} (${item.category})\nClick: +Plan • Right-click: Recipes`}
                          >
                            <div className="relative flex h-6 w-6 items-center justify-center shrink-0">
                              {isImageUrl ? (
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className="h-6 w-6 object-contain group-hover:scale-110 transition-transform pointer-events-none"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-base group-hover:scale-110 transition-transform pointer-events-none">
                                  {item.icon || "📦"}
                                </span>
                              )}

                              {/* Planned Indicator */}
                              {plannedQty !== undefined && (
                                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              )}
                            </div>

                            {/* Item Name (Truncated with ..., subtle/not too bright, small font) */}
                            <span
                              className="mt-1 w-full text-center text-[10px] text-zinc-400 group-hover:text-zinc-200 truncate leading-tight select-none pointer-events-none"
                              title={item.name}
                            >
                              {item.name}
                            </span>

                            {/* Small Info Button on Hover */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailItem(item);
                              }}
                              className="absolute top-1 right-1 h-3.5 w-3.5 rounded bg-black/60 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              title="View Recipes"
                            >
                              <Info className="h-2 w-2" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Footer Hint */}
            <div className="pt-1 text-[10px] text-zinc-600 flex items-center justify-between shrink-0">
              <span>Click: +Plan</span>
              <span>Right-click: Recipes</span>
            </div>
          </aside>
        ) : null}

        {/* Right Canvas: Recipe Dependency Tree Graph + Target Planner */}
        <main className="flex-1 min-w-0 h-full min-h-0 flex flex-col gap-2 overflow-hidden">
          {/* Top Bar with Sidebar Open Button if collapsed */}
          {!isSidebarOpen && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded transition-colors"
              >
                <PanelLeftOpen className="h-3.5 w-3.5 text-indigo-400" />
                <span>Show Catalog ({dataset.items.length})</span>
              </button>
            </div>
          )}

          {/* Production Target Planner Drawer (Sitting directly on top of the right graph canvas) */}
          {isPlannerOpen && (
            <section className="shrink-0 transition-all border-b border-zinc-800/40 pb-1.5">
              <div className="max-h-40 overflow-y-auto">
                {requests.length === 0 ? (
                  <div className="py-2 px-1 text-xs text-zinc-500">
                    No active targets. Select any item from the left catalog to start calculating.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {requests.map((req) => {
                      const item = dataset.items.find((i: GameItem) => i.id === req.itemId);
                      const isImageUrl =
                        item?.icon &&
                        (item.icon.startsWith("/") ||
                          item.icon.startsWith("http") ||
                          item.icon.endsWith(".png") ||
                          item.icon.endsWith(".webp"));

                      return (
                        <div
                          key={req.itemId}
                          className="flex flex-col justify-between p-2 rounded-lg text-xs relative group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors"
                        >
                          {/* Top row: Item thumbnail + Title + Delete button */}
                          <div className="flex items-start gap-2 mb-1.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center p-0.5 bg-black/20 rounded">
                              {isImageUrl ? (
                                <img
                                  src={item.icon}
                                  alt={item.name}
                                  className="h-full w-full object-contain pixelated"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-base">{item?.icon || "📦"}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                              <p
                                className="font-medium text-zinc-100 truncate text-xs"
                                title={item?.name || req.itemId}
                              >
                                {item?.name || req.itemId}
                              </p>
                              <p className="text-[10px] text-zinc-500 truncate">
                                {item?.category || "Item"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveRequest(req.itemId)}
                              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer transition-opacity absolute top-2 right-2"
                              title="Remove target"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Middle row: Sleek rate input with custom styled dark carets */}
                          <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
                            <span className="text-[10px] text-zinc-500">Rate:</span>
                            <div className="flex items-center bg-black/40 rounded border border-zinc-800/80 hover:border-zinc-700/80 focus-within:border-indigo-500/60 transition-colors px-1 py-0.5">
                              <input
                                type="number"
                                min="0.1"
                                step="any"
                                value={req.targetQuantityPerMinute}
                                onChange={(e) =>
                                  handleUpdateQuantity(req.itemId, parseFloat(e.target.value) || 0)
                                }
                                className="w-12 bg-transparent text-right font-mono text-xs text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              {/* Custom Styled Dark Arrow Carets */}
                              <div className="flex flex-col ml-1 pl-1 border-l border-zinc-800/80 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      req.itemId,
                                      Math.max(1, (Number(req.targetQuantityPerMinute) || 0) + 10)
                                    )
                                  }
                                  className="text-zinc-500 hover:text-zinc-200 p-0.5 transition-colors cursor-pointer leading-none flex items-center justify-center hover:bg-white/[0.08] rounded-sm"
                                  title="Increase by 10"
                                >
                                  <ChevronUp className="h-2.5 w-2.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      req.itemId,
                                      Math.max(1, (Number(req.targetQuantityPerMinute) || 0) - 10)
                                    )
                                  }
                                  className="text-zinc-500 hover:text-zinc-200 p-0.5 transition-colors cursor-pointer leading-none flex items-center justify-center hover:bg-white/[0.08] rounded-sm"
                                  title="Decrease by 10"
                                >
                                  <ChevronDown className="h-2.5 w-2.5" />
                                </button>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono ml-1">/m</span>
                            </div>
                          </div>

                          {/* Bottom row: Recipe Method Selector if multiple recipes exist */}
                          {item && item.recipes && item.recipes.length > 1 ? (
                            <select
                              value={req.recipeId || item.recipes[0]?.id}
                              onChange={(e) => {
                                const recId = e.target.value;
                                setRequests((prev) =>
                                  prev.map((r) =>
                                    r.itemId === req.itemId ? { ...r, recipeId: recId } : r
                                  )
                                );
                              }}
                              className="w-full bg-transparent px-0.5 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200 focus:outline-none truncate cursor-pointer"
                            >
                              {item.recipes.map((rec) => (
                                <option key={rec.id} value={rec.id} className="bg-zinc-950 text-zinc-200">
                                  {rec.method || rec.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="text-[10px] text-zinc-600 truncate px-0.5">
                              {item?.recipes?.[0]?.method || "Standard"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Graph View */}
          <RecipeGraphView
            calculation={graphCalculation}
            onSwitchIngredient={handleSwitchIngredient}
            onNodeClick={(item) => {
              const availableRecipes = item.recipes || (item.recipe ? [item.recipe] : []);
              if (availableRecipes.length > 1) {
                setChooserItem(item);
              }
            }}
          />
        </main>
      </div>

      {/* Recipe Selection Modal when multiple recipes exist */}
      <RecipeChooserModal
        item={chooserItem}
        currentRecipeId={
          chooserItem
            ? requests.find((r) => r.itemId === chooserItem.id)?.recipeId ||
              recipeOverrides[chooserItem.id]
            : undefined
        }
        open={!!chooserItem}
        onOpenChange={(open) => !open && setChooserItem(null)}
        onSelectRecipe={handleSelectRecipe}
      />

      {/* Item Detail Recipe Modal */}
      <ItemDetailPopup
        item={detailItem}
        open={!!detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
        onAddToPlanner={handleItemClick}
        onReportIssue={(item) => {
          setReportItem(item);
          setIsReportOpen(true);
        }}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        dataset={dataset}
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        preselectedItem={reportItem}
      />
    </div>
  );
}
