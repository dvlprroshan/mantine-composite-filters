import { createElement, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import type { 
  ActiveFilter, 
  SavedFilterPreset, 
  UseFilterPresetsOptions,
  UseFilterPresetsReturn 
} from "../types/filter.types";
import { generateId } from "../utils";
import { useStorageState } from "../storage";

export const useFilterPresets = (
  options: UseFilterPresetsOptions = {}
): UseFilterPresetsReturn => {
  const { 
    storageKey = "filters-saved-presets", 
    onLoad,
    storageAdapter,
  } = options;

  const [savedPresets, setSavedPresets] = useStorageState<SavedFilterPreset[]>({
    adapter: storageAdapter,
    storageKey,
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

      if (!name) {
        notifications.show({
          title: "Preset name required",
          message: "Please provide a name for this preset.",
          color: "red",
        });
        return null;
      }

      const presetName = name;
      const serializableFilters = filters.map(({ icon, ...rest }) => rest);

      const newPreset: SavedFilterPreset = {
        id: generateId(),
        name: presetName,
        filters: serializableFilters as ActiveFilter[],
        createdAt: Date.now(),
      };

      setSavedPresets((prev) => [...prev, newPreset]);
      
      notifications.show({
        title: "Preset saved",
        message: `"${presetName}" has been saved`,
        color: "green",
        icon: createElement(IconCheck, { size: 16 }),
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
