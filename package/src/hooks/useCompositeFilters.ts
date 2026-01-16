import { useCallback, useMemo, useRef, useEffect } from "react";
import type {
  ActiveFilter,
  FilterDefinition,
  FilterOperator,
  FilterHistory,
  SavedFilterPreset,
  FilterValue,
} from "../types/filter.types";
import { useStorageState, type StorageAdapter } from "../storage";
import { generateId } from "../utils";

export interface UseCompositeFiltersOptions {
  filterDefinitions: FilterDefinition[];
  initialFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
  storageKey?: string;
  storageAdapter?: StorageAdapter<ActiveFilter[]>;
  presetsStorageKey?: string;
  presetsStorageAdapter?: StorageAdapter<SavedFilterPreset[]>;
  historyStorageKey?: string;
  historyStorageAdapter?: StorageAdapter<FilterHistory[]>;
  maxHistory?: number;
  enableHistory?: boolean;
  enablePresets?: boolean;
}

export interface UseCompositeFiltersReturn {
  activeFilters: ActiveFilter[];
  setActiveFilters: (filters: ActiveFilter[] | ((prev: ActiveFilter[]) => ActiveFilter[])) => void;
  filterDefinitions: FilterDefinition[];

  addFilter: (filter: Omit<ActiveFilter, "id">) => string;
  addFilterByKey: (
    key: string,
    operator: FilterOperator,
    value: FilterValue,
    displayValue?: string
  ) => string | null;
  removeFilter: (id: string) => void;
  removeFilterByKey: (key: string) => void;
  removeFiltersByKeys: (keys: string[]) => void;
  updateFilter: (id: string, updates: Partial<Omit<ActiveFilter, "id">>) => void;
  updateFilterValue: (id: string, value: FilterValue, displayValue?: string) => void;
  updateFilterOperator: (id: string, operator: FilterOperator) => void;
  replaceFilter: (id: string, newFilter: Omit<ActiveFilter, "id">) => void;
  clearFilters: () => void;
  resetFilters: () => void;

  getFilterById: (id: string) => ActiveFilter | undefined;
  getFilterByKey: (key: string) => ActiveFilter | undefined;
  getFiltersByKey: (key: string) => ActiveFilter[];
  getFiltersByType: (type: ActiveFilter["type"]) => ActiveFilter[];
  getFiltersByOperator: (operator: FilterOperator) => ActiveFilter[];
  getFirstFilter: () => ActiveFilter | undefined;
  getLastFilter: () => ActiveFilter | undefined;

  hasFilter: (key: string) => boolean;
  hasFilterById: (id: string) => boolean;
  hasFilterWithValue: (key: string, value: FilterValue) => boolean;
  hasAnyFilter: () => boolean;
  hasMultipleFilters: () => boolean;
  filtersCount: number;

  moveFilterUp: (id: string) => void;
  moveFilterDown: (id: string) => void;
  moveFilterToStart: (id: string) => void;
  moveFilterToEnd: (id: string) => void;
  swapFilters: (id1: string, id2: string) => void;
  reorderFilters: (ids: string[]) => void;

  duplicateFilter: (id: string) => string | null;
  toggleFilter: (
    key: string,
    operator: FilterOperator,
    value: FilterValue,
    displayValue?: string
  ) => void;
  upsertFilter: (
    key: string,
    operator: FilterOperator,
    value: FilterValue,
    displayValue?: string
  ) => string;

  toQueryParams: () => Record<string, string | string[]>;
  toQueryString: () => string;
  toApiFormat: () => Array<{ field: string; operator: FilterOperator; value: FilterValue }>;
  toJSON: () => string;
  fromJSON: (json: string) => boolean;
  serialize: () => string;
  deserialize: (data: string) => boolean;

  presets: SavedFilterPreset[];
  sortedPresets: SavedFilterPreset[];
  savePreset: (name: string) => SavedFilterPreset | null;
  loadPreset: (preset: SavedFilterPreset) => void;
  loadPresetById: (presetId: string) => boolean;
  deletePreset: (presetId: string) => void;
  updatePreset: (presetId: string, updates: Partial<Omit<SavedFilterPreset, "id">>) => void;
  renamePreset: (presetId: string, newName: string) => void;
  togglePresetFavorite: (presetId: string) => void;
  duplicatePreset: (presetId: string, newName?: string) => SavedFilterPreset | null;
  overwritePreset: (presetId: string) => void;
  hasPresets: boolean;
  presetsCount: number;
  favoritePresets: SavedFilterPreset[];
  getPresetById: (presetId: string) => SavedFilterPreset | undefined;
  clearPresets: () => void;

  history: FilterHistory[];
  recentHistory: FilterHistory[];
  loadFromHistory: (historyItem: FilterHistory) => void;
  loadFromHistoryByIndex: (index: number) => boolean;
  clearHistory: () => void;
  removeHistoryItem: (timestamp: number) => void;
  hasHistory: boolean;
  historyCount: number;
  undoToLastHistory: () => boolean;

  getDefinition: (key: string) => FilterDefinition | undefined;
  getAvailableDefinitions: () => FilterDefinition[];
  isDefinitionUsed: (key: string) => boolean;
  canAddMoreFilters: (maxFilters?: number) => boolean;

  isDirty: boolean;
  markAsClean: () => void;
  hasUnsavedChanges: () => boolean;
}

export const useCompositeFilters = (
  options: UseCompositeFiltersOptions
): UseCompositeFiltersReturn => {
  const {
    filterDefinitions,
    initialFilters = [],
    onFiltersChange,
    storageKey,
    storageAdapter,
    presetsStorageKey = "composite-filters-presets",
    presetsStorageAdapter,
    historyStorageKey = "composite-filters-history",
    historyStorageAdapter,
    maxHistory = 10,
    enableHistory = true,
    enablePresets = true,
  } = options;

  const [activeFilters, setActiveFiltersInternal] = useStorageState<ActiveFilter[]>({
    adapter: storageAdapter,
    storageKey,
    defaultValue: initialFilters,
  });

  const [savedPresets, setSavedPresets] = useStorageState<SavedFilterPreset[]>({
    adapter: presetsStorageAdapter,
    storageKey: enablePresets ? presetsStorageKey : undefined,
    defaultValue: [],
  });

  const [filterHistory, setFilterHistory] = useStorageState<FilterHistory[]>({
    adapter: historyStorageAdapter,
    storageKey: enableHistory ? historyStorageKey : undefined,
    defaultValue: [],
  });

  const cleanStateRef = useRef<string>(JSON.stringify(initialFilters));
  const lastHistoryUpdateRef = useRef<string>("");

  const setActiveFilters = useCallback(
    (filters: ActiveFilter[] | ((prev: ActiveFilter[]) => ActiveFilter[])) => {
      setActiveFiltersInternal((prev) => {
        const newFilters = typeof filters === "function" ? filters(prev) : filters;
        onFiltersChange?.(newFilters);
        return newFilters;
      });
    },
    [setActiveFiltersInternal, onFiltersChange]
  );

  useEffect(() => {
    if (!enableHistory || activeFilters.length === 0) {
      return;
    }

    const serializableFilters = activeFilters.map(({ icon, ...rest }) => rest);
    const serialized = JSON.stringify(serializableFilters);

    if (serialized === lastHistoryUpdateRef.current) {
      return;
    }
    lastHistoryUpdateRef.current = serialized;

    const newHistory: FilterHistory = {
      filters: serializableFilters as ActiveFilter[],
      timestamp: Date.now(),
    };

    setFilterHistory((prev) => {
      const filtered = prev.filter(
        (h) => JSON.stringify(h.filters) !== serialized
      );
      return [newHistory, ...filtered].slice(0, maxHistory);
    });
  }, [activeFilters, setFilterHistory, maxHistory, enableHistory]);

  const addFilter = useCallback(
    (filter: Omit<ActiveFilter, "id">): string => {
      const id = generateId();
      const newFilter: ActiveFilter = { ...filter, id };
      setActiveFilters((prev) => [...prev, newFilter]);
      return id;
    },
    [setActiveFilters]
  );

  const addFilterByKey = useCallback(
    (
      key: string,
      operator: FilterOperator,
      value: FilterValue,
      displayValue?: string
    ): string | null => {
      const definition = filterDefinitions.find((d) => d.key === key);
      if (!definition) {
        return null;
      }

      const resolvedDisplayValue =
        displayValue ?? (Array.isArray(value) ? value.join(", ") : String(value));

      return addFilter({
        key,
        label: definition.label,
        type: definition.type,
        operator,
        value,
        displayValue: resolvedDisplayValue,
        icon: definition.icon,
      });
    },
    [filterDefinitions, addFilter]
  );

  const removeFilter = useCallback(
    (id: string) => {
      setActiveFilters((prev) => prev.filter((f) => f.id !== id));
    },
    [setActiveFilters]
  );

  const removeFilterByKey = useCallback(
    (key: string) => {
      setActiveFilters((prev) => prev.filter((f) => f.key !== key));
    },
    [setActiveFilters]
  );

  const removeFiltersByKeys = useCallback(
    (keys: string[]) => {
      const keySet = new Set(keys);
      setActiveFilters((prev) => prev.filter((f) => !keySet.has(f.key)));
    },
    [setActiveFilters]
  );

  const updateFilter = useCallback(
    (id: string, updates: Partial<Omit<ActiveFilter, "id">>) => {
      setActiveFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    [setActiveFilters]
  );

  const updateFilterValue = useCallback(
    (id: string, value: FilterValue, displayValue?: string) => {
      const resolvedDisplayValue =
        displayValue ?? (Array.isArray(value) ? value.join(", ") : String(value));
      updateFilter(id, { value, displayValue: resolvedDisplayValue });
    },
    [updateFilter]
  );

  const updateFilterOperator = useCallback(
    (id: string, operator: FilterOperator) => {
      updateFilter(id, { operator });
    },
    [updateFilter]
  );

  const replaceFilter = useCallback(
    (id: string, newFilter: Omit<ActiveFilter, "id">) => {
      setActiveFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...newFilter, id } : f))
      );
    },
    [setActiveFilters]
  );

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
  }, [setActiveFilters]);

  const resetFilters = useCallback(() => {
    setActiveFilters(initialFilters);
    cleanStateRef.current = JSON.stringify(initialFilters);
  }, [setActiveFilters, initialFilters]);

  const getFilterById = useCallback(
    (id: string) => activeFilters.find((f) => f.id === id),
    [activeFilters]
  );

  const getFilterByKey = useCallback(
    (key: string) => activeFilters.find((f) => f.key === key),
    [activeFilters]
  );

  const getFiltersByKey = useCallback(
    (key: string) => activeFilters.filter((f) => f.key === key),
    [activeFilters]
  );

  const getFiltersByType = useCallback(
    (type: ActiveFilter["type"]) => activeFilters.filter((f) => f.type === type),
    [activeFilters]
  );

  const getFiltersByOperator = useCallback(
    (operator: FilterOperator) => activeFilters.filter((f) => f.operator === operator),
    [activeFilters]
  );

  const getFirstFilter = useCallback(() => activeFilters[0], [activeFilters]);

  const getLastFilter = useCallback(
    () => activeFilters[activeFilters.length - 1],
    [activeFilters]
  );

  const hasFilter = useCallback(
    (key: string) => activeFilters.some((f) => f.key === key),
    [activeFilters]
  );

  const hasFilterById = useCallback(
    (id: string) => activeFilters.some((f) => f.id === id),
    [activeFilters]
  );

  const hasFilterWithValue = useCallback(
    (key: string, value: FilterValue) =>
      activeFilters.some(
        (f) => f.key === key && JSON.stringify(f.value) === JSON.stringify(value)
      ),
    [activeFilters]
  );

  const hasAnyFilter = useCallback(() => activeFilters.length > 0, [activeFilters]);

  const hasMultipleFilters = useCallback(
    () => activeFilters.length > 1,
    [activeFilters]
  );

  const moveFilterUp = useCallback(
    (id: string) => {
      setActiveFilters((prev) => {
        const index = prev.findIndex((f) => f.id === id);
        if (index <= 0) {
          return prev;
        }
        const newFilters = [...prev];
        [newFilters[index - 1], newFilters[index]] = [newFilters[index], newFilters[index - 1]];
        return newFilters;
      });
    },
    [setActiveFilters]
  );

  const moveFilterDown = useCallback(
    (id: string) => {
      setActiveFilters((prev) => {
        const index = prev.findIndex((f) => f.id === id);
        if (index < 0 || index >= prev.length - 1) {
          return prev;
        }
        const newFilters = [...prev];
        [newFilters[index], newFilters[index + 1]] = [newFilters[index + 1], newFilters[index]];
        return newFilters;
      });
    },
    [setActiveFilters]
  );

  const moveFilterToStart = useCallback(
    (id: string) => {
      setActiveFilters((prev) => {
        const index = prev.findIndex((f) => f.id === id);
        if (index <= 0) {
          return prev;
        }
        const filter = prev[index];
        return [filter, ...prev.slice(0, index), ...prev.slice(index + 1)];
      });
    },
    [setActiveFilters]
  );

  const moveFilterToEnd = useCallback(
    (id: string) => {
      setActiveFilters((prev) => {
        const index = prev.findIndex((f) => f.id === id);
        if (index < 0 || index === prev.length - 1) {
          return prev;
        }
        const filter = prev[index];
        return [...prev.slice(0, index), ...prev.slice(index + 1), filter];
      });
    },
    [setActiveFilters]
  );

  const swapFilters = useCallback(
    (id1: string, id2: string) => {
      setActiveFilters((prev) => {
        const index1 = prev.findIndex((f) => f.id === id1);
        const index2 = prev.findIndex((f) => f.id === id2);
        if (index1 < 0 || index2 < 0) {
          return prev;
        }
        const newFilters = [...prev];
        [newFilters[index1], newFilters[index2]] = [newFilters[index2], newFilters[index1]];
        return newFilters;
      });
    },
    [setActiveFilters]
  );

  const reorderFilters = useCallback(
    (ids: string[]) => {
      setActiveFilters((prev) => {
        const filterMap = new Map(prev.map((f) => [f.id, f]));
        const reordered: ActiveFilter[] = [];
        for (const id of ids) {
          const filter = filterMap.get(id);
          if (filter) {
            reordered.push(filter);
            filterMap.delete(id);
          }
        }
        return [...reordered, ...filterMap.values()];
      });
    },
    [setActiveFilters]
  );

  const duplicateFilter = useCallback(
    (id: string): string | null => {
      const filter = activeFilters.find((f) => f.id === id);
      if (!filter) {
        return null;
      }
      const { id: _, ...filterWithoutId } = filter;
      return addFilter(filterWithoutId);
    },
    [activeFilters, addFilter]
  );

  const toggleFilter = useCallback(
    (
      key: string,
      operator: FilterOperator,
      value: FilterValue,
      displayValue?: string
    ) => {
      const existing = activeFilters.find(
        (f) =>
          f.key === key &&
          f.operator === operator &&
          JSON.stringify(f.value) === JSON.stringify(value)
      );
      if (existing) {
        removeFilter(existing.id);
      } else {
        addFilterByKey(key, operator, value, displayValue);
      }
    },
    [activeFilters, removeFilter, addFilterByKey]
  );

  const upsertFilter = useCallback(
    (
      key: string,
      operator: FilterOperator,
      value: FilterValue,
      displayValue?: string
    ): string => {
      const existing = activeFilters.find((f) => f.key === key);
      if (existing) {
        const resolvedDisplayValue =
          displayValue ?? (Array.isArray(value) ? value.join(", ") : String(value));
        updateFilter(existing.id, { operator, value, displayValue: resolvedDisplayValue });
        return existing.id;
      }
      return addFilterByKey(key, operator, value, displayValue) ?? "";
    },
    [activeFilters, updateFilter, addFilterByKey]
  );

  const toQueryParams = useCallback(() => {
    const params: Record<string, string | string[]> = {};
    activeFilters.forEach((filter) => {
      const paramKey = `filter[${filter.key}][${filter.operator}]`;
      if (Array.isArray(filter.value)) {
        if (filter.type === "date_range") {
          const [start, end] = filter.value as [Date | null, Date | null];
          if (start) {
            params[`${filter.key}_start`] = start.toISOString().split("T")[0];
          }
          if (end) {
            params[`${filter.key}_end`] = end.toISOString().split("T")[0];
          }
        } else {
          params[paramKey] = filter.value as string[];
        }
      } else {
        params[paramKey] = filter.value as string;
      }
    });
    return params;
  }, [activeFilters]);

  const toQueryString = useCallback(() => {
    const params = toQueryParams();
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    });
    return searchParams.toString();
  }, [toQueryParams]);

  const toApiFormat = useCallback(() => {
    return activeFilters.map((filter) => ({
      field: filter.key,
      operator: filter.operator,
      value: filter.value,
    }));
  }, [activeFilters]);

  const toJSON = useCallback(() => {
    const serializableFilters = activeFilters.map(({ icon, ...rest }) => rest);
    return JSON.stringify(serializableFilters, null, 2);
  }, [activeFilters]);

  const fromJSON = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json) as ActiveFilter[];
        if (!Array.isArray(parsed)) {
          return false;
        }
        const restoredFilters = parsed.map((filter) => {
          const definition = filterDefinitions.find((d) => d.key === filter.key);
          return {
            ...filter,
            id: filter.id || generateId(),
            icon: definition?.icon,
          };
        });
        setActiveFilters(restoredFilters);
        return true;
      } catch {
        return false;
      }
    },
    [setActiveFilters, filterDefinitions]
  );

  const serialize = useCallback(() => {
    return btoa(toJSON());
  }, [toJSON]);

  const deserialize = useCallback(
    (data: string): boolean => {
      try {
        const json = atob(data);
        return fromJSON(json);
      } catch {
        return false;
      }
    },
    [fromJSON]
  );

  const savePreset = useCallback(
    (name: string): SavedFilterPreset | null => {
      if (activeFilters.length === 0 || !name.trim()) {
        return null;
      }

      const serializableFilters = activeFilters.map(({ icon, ...rest }) => rest);
      const newPreset: SavedFilterPreset = {
        id: generateId(),
        name: name.trim(),
        filters: serializableFilters as ActiveFilter[],
        createdAt: Date.now(),
      };

      setSavedPresets((prev) => [...prev, newPreset]);
      return newPreset;
    },
    [activeFilters, setSavedPresets]
  );

  const loadPreset = useCallback(
    (preset: SavedFilterPreset) => {
      const restoredFilters = preset.filters.map((filter) => {
        const definition = filterDefinitions.find((d) => d.key === filter.key);
        return {
          ...filter,
          id: generateId(),
          icon: definition?.icon,
        };
      });
      setActiveFilters(restoredFilters);
    },
    [setActiveFilters, filterDefinitions]
  );

  const loadPresetById = useCallback(
    (presetId: string): boolean => {
      const preset = savedPresets.find((p) => p.id === presetId);
      if (!preset) {
        return false;
      }
      loadPreset(preset);
      return true;
    },
    [savedPresets, loadPreset]
  );

  const deletePreset = useCallback(
    (presetId: string) => {
      setSavedPresets((prev) => prev.filter((p) => p.id !== presetId));
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

  const renamePreset = useCallback(
    (presetId: string, newName: string) => {
      updatePreset(presetId, { name: newName.trim() });
    },
    [updatePreset]
  );

  const togglePresetFavorite = useCallback(
    (presetId: string) => {
      setSavedPresets((prev) =>
        prev.map((p) =>
          p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    },
    [setSavedPresets]
  );

  const duplicatePreset = useCallback(
    (presetId: string, newName?: string): SavedFilterPreset | null => {
      const preset = savedPresets.find((p) => p.id === presetId);
      if (!preset) {
        return null;
      }

      const duplicated: SavedFilterPreset = {
        ...preset,
        id: generateId(),
        name: newName?.trim() || `${preset.name} (copy)`,
        createdAt: Date.now(),
        isFavorite: false,
      };

      setSavedPresets((prev) => [...prev, duplicated]);
      return duplicated;
    },
    [savedPresets, setSavedPresets]
  );

  const overwritePreset = useCallback(
    (presetId: string) => {
      const serializableFilters = activeFilters.map(({ icon, ...rest }) => rest);
      updatePreset(presetId, { filters: serializableFilters as ActiveFilter[] });
    },
    [activeFilters, updatePreset]
  );

  const getPresetById = useCallback(
    (presetId: string) => savedPresets.find((p) => p.id === presetId),
    [savedPresets]
  );

  const clearPresets = useCallback(() => {
    setSavedPresets([]);
  }, [setSavedPresets]);

  const sortedPresets = useMemo(
    () =>
      [...savedPresets].sort(
        (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
      ),
    [savedPresets]
  );

  const favoritePresets = useMemo(
    () => savedPresets.filter((p) => p.isFavorite),
    [savedPresets]
  );

  const loadFromHistory = useCallback(
    (historyItem: FilterHistory) => {
      const restoredFilters = historyItem.filters.map((filter) => {
        const definition = filterDefinitions.find((d) => d.key === filter.key);
        return {
          ...filter,
          id: generateId(),
          icon: definition?.icon,
        };
      });
      setActiveFilters(restoredFilters);
    },
    [setActiveFilters, filterDefinitions]
  );

  const loadFromHistoryByIndex = useCallback(
    (index: number): boolean => {
      if (index < 0 || index >= filterHistory.length) {
        return false;
      }
      loadFromHistory(filterHistory[index]);
      return true;
    },
    [filterHistory, loadFromHistory]
  );

  const clearHistory = useCallback(() => {
    setFilterHistory([]);
  }, [setFilterHistory]);

  const removeHistoryItem = useCallback(
    (timestamp: number) => {
      setFilterHistory((prev) => prev.filter((h) => h.timestamp !== timestamp));
    },
    [setFilterHistory]
  );

  const undoToLastHistory = useCallback((): boolean => {
    if (filterHistory.length < 2) {
      return false;
    }
    loadFromHistory(filterHistory[1]);
    return true;
  }, [filterHistory, loadFromHistory]);

  const getDefinition = useCallback(
    (key: string) => filterDefinitions.find((d) => d.key === key),
    [filterDefinitions]
  );

  const getAvailableDefinitions = useCallback(() => {
    const usedKeys = new Set(activeFilters.map((f) => f.key));
    return filterDefinitions.filter((d) => !usedKeys.has(d.key));
  }, [filterDefinitions, activeFilters]);

  const isDefinitionUsed = useCallback(
    (key: string) => activeFilters.some((f) => f.key === key),
    [activeFilters]
  );

  const canAddMoreFilters = useCallback(
    (maxFilters?: number) => {
      if (maxFilters === undefined) {
        return true;
      }
      return activeFilters.length < maxFilters;
    },
    [activeFilters]
  );

  const isDirty = useMemo(
    () => JSON.stringify(activeFilters) !== cleanStateRef.current,
    [activeFilters]
  );

  const markAsClean = useCallback(() => {
    cleanStateRef.current = JSON.stringify(activeFilters);
  }, [activeFilters]);

  const hasUnsavedChanges = useCallback(() => isDirty, [isDirty]);

  return {
    activeFilters,
    setActiveFilters,
    filterDefinitions,

    addFilter,
    addFilterByKey,
    removeFilter,
    removeFilterByKey,
    removeFiltersByKeys,
    updateFilter,
    updateFilterValue,
    updateFilterOperator,
    replaceFilter,
    clearFilters,
    resetFilters,

    getFilterById,
    getFilterByKey,
    getFiltersByKey,
    getFiltersByType,
    getFiltersByOperator,
    getFirstFilter,
    getLastFilter,

    hasFilter,
    hasFilterById,
    hasFilterWithValue,
    hasAnyFilter,
    hasMultipleFilters,
    filtersCount: activeFilters.length,

    moveFilterUp,
    moveFilterDown,
    moveFilterToStart,
    moveFilterToEnd,
    swapFilters,
    reorderFilters,

    duplicateFilter,
    toggleFilter,
    upsertFilter,

    toQueryParams,
    toQueryString,
    toApiFormat,
    toJSON,
    fromJSON,
    serialize,
    deserialize,

    presets: savedPresets,
    sortedPresets,
    savePreset,
    loadPreset,
    loadPresetById,
    deletePreset,
    updatePreset,
    renamePreset,
    togglePresetFavorite,
    duplicatePreset,
    overwritePreset,
    hasPresets: savedPresets.length > 0,
    presetsCount: savedPresets.length,
    favoritePresets,
    getPresetById,
    clearPresets,

    history: filterHistory,
    recentHistory: filterHistory.slice(0, 5),
    loadFromHistory,
    loadFromHistoryByIndex,
    clearHistory,
    removeHistoryItem,
    hasHistory: filterHistory.length > 0,
    historyCount: filterHistory.length,
    undoToLastHistory,

    getDefinition,
    getAvailableDefinitions,
    isDefinitionUsed,
    canAddMoreFilters,

    isDirty,
    markAsClean,
    hasUnsavedChanges,
  };
};
