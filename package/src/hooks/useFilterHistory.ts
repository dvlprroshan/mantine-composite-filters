import { useCallback, useEffect } from "react";
import type { 
  ActiveFilter, 
  FilterHistory, 
  UseFilterHistoryOptions,
  UseFilterHistoryReturn 
} from "../types/filter.types";
import { useStorageState } from "../storage";

export const useFilterHistory = (
  activeFilters: ActiveFilter[],
  options: UseFilterHistoryOptions = {}
): UseFilterHistoryReturn => {
  const { 
    storageKey = "filters-history", 
    maxHistory = 10,
    enabled = true,
    storageAdapter,
  } = options;

  const [filterHistory, setFilterHistory] = useStorageState<FilterHistory[]>({
    adapter: storageAdapter,
    storageKey: enabled ? storageKey : undefined,
    defaultValue: [],
  });

  useEffect(() => {
    if (!enabled || activeFilters.length === 0) {return;}

    const serializableFilters = activeFilters.map(({ icon, ...rest }) => rest);
    
    const newHistory: FilterHistory = {
      filters: serializableFilters as ActiveFilter[],
      timestamp: Date.now(),
    };

    setFilterHistory((prev) => {
      const filtered = prev.filter(
        (h) => JSON.stringify(h.filters) !== JSON.stringify(serializableFilters)
      );
      return [newHistory, ...filtered].slice(0, maxHistory);
    });
  }, [activeFilters, setFilterHistory, maxHistory, enabled]);

  const clearHistory = useCallback(() => {
    setFilterHistory([]);
  }, [setFilterHistory]);

  const removeHistoryItem = useCallback(
    (timestamp: number) => {
      setFilterHistory((prev) => prev.filter((h) => h.timestamp !== timestamp));
    },
    [setFilterHistory]
  );

  return {
    history: filterHistory,
    recentHistory: filterHistory.slice(0, 5),
    clearHistory,
    removeHistoryItem,
    hasHistory: filterHistory.length > 0,
  };
};
