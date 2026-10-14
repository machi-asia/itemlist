"use client";

import React, { useState, useEffect } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { RecipeCustomNode } from "../../types/graph";
import { cn } from "../../lib/utils";
import { RefreshCw } from "lucide-react";

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
    candidateOptions,
    activeCandidateId,
    onSwitchIngredient,
    groupKey,
    isRawInput,
    onToggleRawInput,
    onNodeClick,
  } = data;

  const [cycleIndex, setCycleIndex] = useState(0);

  // Cycle candidate options every 1.5 seconds if multiple options exist
  useEffect(() => {
    if (!candidateOptions || candidateOptions.length <= 1) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % candidateOptions.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [candidateOptions]);

  const activeOption = candidateOptions && candidateOptions.length > 0
    ? candidateOptions[cycleIndex % candidateOptions.length]
    : undefined;

  const currentIcon = activeOption?.icon || itemIcon;
  const currentLabel = activeOption?.name || label;

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
      onClick={(e) => {
        // If clicking an interactive button inside (like ingredient switcher), ignore node click
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("select")) return;
        if (onNodeClick && data.item) {
          onNodeClick(data.item);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleRawInput && data.item) {
          onToggleRawInput(data.item.id);
        }
      }}
      className={cn(
        "relative flex flex-col justify-between w-[270px] rounded-lg p-3 transition-all backdrop-blur-sm border shadow-lg cursor-pointer select-none",
        isRawInput
          ? "bg-sky-950/40 border-sky-500/70 ring-2 ring-sky-500/50 shadow-sky-500/20"
          : isRequested
          ? "bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/40"
          : "bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900"
      )}
    >
      {/* 1. Left Input Socket(s) - Hidden when set as raw input */}
      {!isRawInput && !hasMultipleIngredients ? (
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
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white/[0.04] overflow-hidden">
          {currentIcon.startsWith("/") || currentIcon.startsWith("http") ? (
            <img
              src={currentIcon}
              alt={currentLabel}
              className="h-7 w-7 object-contain pixelated transition-all duration-300"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onError={(e) => {
                // If local image fails or 404s, fall back to Minecraft Wiki / assets URL or generic icon
                const target = e.currentTarget;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "true";
                  const cleanName = currentLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_");
                  target.src = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${cleanName}.png`;
                } else {
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-label")) {
                    const span = document.createElement("span");
                    span.className = "fallback-label text-xs font-semibold text-zinc-400";
                    span.textContent = currentLabel.slice(0, 2).toUpperCase();
                    parent.appendChild(span);
                  }
                }
              }}
            />
          ) : (
            <span className="text-lg">{currentIcon || "📦"}</span>
          )}
          {candidateOptions && candidateOptions.length > 1 && (
            <div className="absolute bottom-0 right-0 p-0.5 bg-black/70 rounded-tl-[3px] text-[7px] text-amber-400">
              <RefreshCw className="h-2 w-2 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="truncate font-semibold text-xs text-zinc-100" title={currentLabel}>
              {currentLabel}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              {sourceMod && (
                <span className="rounded bg-white/[0.06] px-1 py-0.2 text-[8px] font-medium text-zinc-400">
                  {sourceMod}
                </span>
              )}
              {isRawInput && (
                <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[9px] font-semibold text-sky-300 border border-sky-500/40">
                  Raw Input
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

      {/* Candidate Ingredient Switcher (When an ingredient provides a choice) */}
      {!isRawInput && candidateOptions && candidateOptions.length > 1 && onSwitchIngredient && groupKey && (
        <div className="mt-2 pt-1.5 border-t border-zinc-800/60 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1 text-amber-300/90">
              <RefreshCw className="h-2.5 w-2.5" />
              <span>Choose Ingredient:</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {candidateOptions.map((opt) => {
              const isSelected = activeCandidateId === opt.id;
              const isImg = opt.icon && (opt.icon.startsWith("/") || opt.icon.startsWith("http"));
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwitchIngredient(groupKey, opt.id);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all text-left truncate border",
                    isSelected
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-sm"
                      : "bg-white/[0.03] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08]"
                  )}
                  title={`Switch to ${opt.name}`}
                >
                  {isImg ? (
                    <img
                      src={opt.icon}
                      alt={opt.name}
                      className="h-3 w-3 object-contain pixelated shrink-0"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] shrink-0">{opt.icon || "📦"}</span>
                  )}
                  <span className="truncate">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Dynamic Blender-Style Ingredient Ports List (when multiple inputs exist) */}
      {!isRawInput && hasMultipleIngredients && (
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
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = "true";
                          const cleanName = ing.itemName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
                          target.src = `https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures/item/${cleanName}.png`;
                        } else {
                          target.style.display = "none";
                        }
                      }}
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
      {!isRawInput && building && (
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
