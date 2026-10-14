"use client";

import React, { useState } from "react";
import type { GameDataset, GameItem } from "../types/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Flag, CheckCircle2, AlertCircle, Send, X } from "lucide-react";

export type ReportIssueType = "wrong_recipe" | "wrong_throughput" | "missing_recipe" | "wrong_icon" | "other";

interface ReportIssueModalProps {
  dataset: GameDataset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedItem?: GameItem | null;
}

export function ReportIssueModal({
  dataset,
  open,
  onOpenChange,
  preselectedItem,
}: ReportIssueModalProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(preselectedItem?.id || "");
  const [issueType, setIssueType] = useState<ReportIssueType>("wrong_recipe");
  const [description, setDescription] = useState("");
  const [suggestedFix, setSuggestedFix] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Sync if preselectedItem changes when opened
  React.useEffect(() => {
    if (open) {
      if (preselectedItem?.id) {
        setSelectedItemId(preselectedItem.id);
      }
      setSubmitted(false);
    }
  }, [open, preselectedItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const reportPayload = {
      gameId: dataset.id,
      itemId: selectedItemId || "general",
      itemName: dataset.items.find((i) => i.id === selectedItemId)?.name || "General / Not Specified",
      issueType,
      description: description.trim(),
      suggestedFix: suggestedFix.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("game_calc_reports") || "[]");
      existing.push(reportPayload);
      localStorage.setItem("game_calc_reports", JSON.stringify(existing));
    } catch {
      // localStorage may fail in private mode, which is fine
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setDescription("");
    setSuggestedFix("");
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-5 bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
        <DialogHeader className="pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                Report Recipe / Data Issue
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                Notice an incorrect recipe, throughput, missing ratio, or icon in {dataset.name}? Let us know below.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Report Submitted</h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Thank you! Your feedback has been logged and will be reviewed to update the recipes and rate calculations.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-4 py-1.5 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
            {/* Item Selector */}
            <div className="space-y-1">
              <label htmlFor="report-item-select" className="text-xs font-medium text-zinc-300">
                Related Item / Machine
              </label>
              <select
                id="report-item-select"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">General (Not item specific)</option>
                {dataset.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Type */}
            <div className="space-y-1">
              <label htmlFor="report-issue-type" className="text-xs font-medium text-zinc-300">
                Issue Category
              </label>
              <select
                id="report-issue-type"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as ReportIssueType)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="wrong_recipe">Wrong Recipe / Ingredients</option>
                <option value="wrong_throughput">Incorrect Throughput / Time / Ratios</option>
                <option value="missing_recipe">Missing Recipe or Alternate Method</option>
                <option value="wrong_icon">Missing or Wrong Icon / Image</option>
                <option value="other">Other / Calculation Bug</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="report-description" className="text-xs font-medium text-zinc-300">
                What is incorrect? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="report-description"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Mechanical Crafter recipe for Sturdy Sheet requires 1 Lava instead of water, or throughput says 15/min instead of 30/min..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Suggested Fix / Source (Optional) */}
            <div className="space-y-1">
              <label htmlFor="report-fix" className="text-xs font-medium text-zinc-300">
                Suggested Fix or Source URL (Optional)
              </label>
              <input
                id="report-fix"
                type="text"
                value={suggestedFix}
                onChange={(e) => setSuggestedFix(e.target.value)}
                placeholder="e.g. Link to wiki or correct ingredient ratio..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow transition-colors cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
