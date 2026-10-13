import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { RecipeCustomNode } from "../../types/graph";
import { cn } from "../../lib/utils";

export function RecipeProcessNode({ data }: NodeProps<RecipeCustomNode>) {
  const {
    label,
    itemIcon,
    outputPerMinute,
    isRequested,
    requestedQuantity,
    building,
    buildingIcon,
    buildingCount,
    cycleTimeSeconds,
    sourceMod,
  } = data;

  const ingredients = data.ingredients || [];
  const hasMultipleIngredients = ingredients.length > 1;

  // Socket accent color palette matching node-based graph editors (Blender / Unreal)
  const SOCKET_COLORS = [
    { bg: "bg-emerald-500", border: "border-emerald-700", text: "text-emerald-400" },
    { bg: "bg-indigo-500", border: "border-indigo-700", text: "text-indigo-400" },
    { bg: "bg-amber-500", border: "border-amber-700", text: "text-amber-400" },
    { bg: "bg-cyan-500", border: "border-cyan-700", text: "text-cyan-400" },
    { bg: "bg-purple-500", border: "border-purple-700", text: "text-purple-400" },
    { bg: "bg-rose-500", border: "border-rose-700", text: "text-rose-400" },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between w-[270px] rounded-lg p-3 transition-all backdrop-blur-sm border shadow-lg",
        isRequested
          ? "bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/40"
          : "bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
      )}
    >
      {/* 1. Left Input Socket(s) */}
      {!hasMultipleIngredients ? (
        // Single default target handle when only 1 or 0 ingredients
        <Handle
          type="target"
          id={ingredients[0] ? `handle-in-${ingredients[0].itemId}` : undefined}
          position={Position.Left}
          className="!w-3 !h-3 !-left-1.5 !bg-emerald-500 !border-2 !border-zinc-900 rounded-full shadow-sm hover:!scale-125 transition-transform"
        />
      ) : null}

      {/* Main Node Header: Item Icon + Name + Rate */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white/[0.04] overflow-hidden">
          {itemIcon.startsWith("/") || itemIcon.startsWith("http") ? (
            <img
              src={itemIcon}
              alt={label}
              className="h-7 w-7 object-contain pixelated"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <span className="text-lg">{itemIcon || "📦"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="truncate font-semibold text-xs text-zinc-100" title={label}>
              {label}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              {sourceMod && (
                <span className="rounded bg-white/[0.06] px-1 py-0.2 text-[8px] font-medium text-zinc-400">
                  {sourceMod}
                </span>
              )}
              {isRequested && (
                <span className="rounded bg-indigo-500/20 px-1 py-0.2 text-[9px] font-semibold text-indigo-300">
                  Target
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            {outputPerMinute} / min
            {requestedQuantity ? ` (${requestedQuantity})` : ""}
          </div>
        </div>
      </div>

      {/* 2. Dynamic Blender-Style Ingredient Ports List (when multiple inputs exist) */}
      {hasMultipleIngredients && (
        <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex flex-col gap-1.5">
          {ingredients.map((ing, idx) => {
            const socketColor = SOCKET_COLORS[idx % SOCKET_COLORS.length]!;
            const isImg = ing.icon && (ing.icon.startsWith("/") || ing.icon.startsWith("http"));

            return (
              <div
                key={ing.itemId || idx}
                className="relative flex items-center justify-between pl-2.5 py-0.5 text-[11px] group"
              >
                {/* Dedicated socket handle positioned exactly at this ingredient row */}
                <Handle
                  type="target"
                  id={`handle-in-${ing.itemId}`}
                  position={Position.Left}
                  className={cn(
                    "!w-3 !h-3 !-left-4.5 !border-2 !border-zinc-900 rounded-full shadow-sm hover:!scale-125 transition-transform",
                    socketColor.bg
                  )}
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                />

                {/* Port label with icon and name matching Blender UI */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {isImg ? (
                    <img
                      src={ing.icon}
                      alt={ing.itemName}
                      className="h-3.5 w-3.5 object-contain pixelated shrink-0"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs leading-none shrink-0">{ing.icon || "📦"}</span>
                  )}
                  <span className="text-zinc-300 font-medium truncate group-hover:text-white transition-colors">
                    {ing.itemName}
                  </span>
                </div>

                {/* Amount / multiplier badge */}
                <span className="font-mono text-[10px] text-zinc-500 ml-1.5 shrink-0">
                  ×{ing.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Facility / Machine Bar */}
      {building && (
        <div className="mt-2 flex items-center justify-between border-t border-zinc-800/40 pt-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 shrink-0">
              {buildingIcon ? (
                <img
                  src={buildingIcon}
                  alt={building}
                  className="h-4 w-4 object-contain shrink-0 rounded-[2px]"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              ) : null}
              {data.pairedCatalystIcon ? (
                <img
                  src={data.pairedCatalystIcon}
                  alt={data.pairedCatalystName || "Catalyst"}
                  className="h-4 w-4 object-contain shrink-0 rounded-[2px] ring-1 ring-white/10"
                  title={data.pairedCatalystName}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              ) : null}
            </div>
            <span className="text-zinc-300 font-medium truncate" title={building}>
              {building}
            </span>
          </div>
          <div className="shrink-0 font-mono font-semibold text-indigo-400 ml-2">
            {buildingCount ? `×${buildingCount}` : ""}
            {cycleTimeSeconds ? ` (${cycleTimeSeconds}s)` : ""}
          </div>
        </div>
      )}

      {/* Right Output Socket */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-indigo-500 !border-2 !border-zinc-900 rounded-full shadow-sm hover:!scale-125 transition-transform"
      />
    </div>
  );
}
