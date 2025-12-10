import { useCallback } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import React from "react";
import type { 
  ActiveFilter, 
  SavedFilterPreset, 
  UseFilterPresetsOptions,
  UseFilterPresetsReturn 
} from "../types/filter.types";
import { generateId } from "../utils";

export const useFilterPresets = (
  options: UseFilterPresetsOptions = {}
): UseFilterPresetsReturn => {
  const { storageKey = "filters-saved-presets", onLoad } = options;

  const [savedPresets, setSavedPresets] = useLocalStorage<SavedFilterPreset[]>({
    key: storageKey,
    defaultValue: [],
  });

  const savePreset = useCallback(
    (filters: ActiveFilter[], name?: string) => {
      if (filters.length === 0) {
        notifications.show({
          title: "No filters to save",
          message: "Add some filters before saving a preset",
          color: "yellow",
        });
        return null;
      }

      const presetName = name || prompt("Enter a name for this filter preset:");
      if (!presetName) return null;

      const newPreset: SavedFilterPreset = {
        id: generateId(),
        name: presetName,
        filters,
        createdAt: Date.now(),
      };

      setSavedPresets((prev) => [...prev, newPreset]);
      
      notifications.show({
        title: "Preset saved",
        message: `"${presetName}" has been saved`,
        color: "green",
        icon: React.createElement(IconCheck, { size: 16 }),
      });

      return newPreset;
    },
    [setSavedPresets]
  );

  const loadPreset = useCallback(
    (preset: SavedFilterPreset) => {
      onLoad?.(preset.filters);
      notifications.show({
        title: "Preset loaded",
        message: `"${preset.name}" has been applied`,
        color: "blue",
      });
    },
    [onLoad]
  );

  const toggleFavorite = useCallback(
    (presetId: string) => {
      setSavedPresets((prev) =>
        prev.map((p) =>
          p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    },
    [setSavedPresets]
  );

  const deletePreset = useCallback(
    (presetId: string) => {
      setSavedPresets((prev) => prev.filter((p) => p.id !== presetId));
      notifications.show({
        title: "Preset deleted",
        message: "The preset has been removed",
        color: "red",
      });
    },
    [setSavedPresets]
  );

  const updatePreset = useCallback(
    (presetId: string, updates: Partial<Omit<SavedFilterPreset, "id">>) => {
      setSavedPresets((prev) =>
        prev.map((p) => (p.id === presetId ? { ...p, ...updates } : p))
      );
    },
    [setSavedPresets]
  );

  const sortedPresets = [...savedPresets].sort(
    (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
  );

  return {
    presets: savedPresets,
    sortedPresets,
    savePreset,
    loadPreset,
    toggleFavorite,
    deletePreset,
    updatePreset,
    hasPresets: savedPresets.length > 0,
  };
};

