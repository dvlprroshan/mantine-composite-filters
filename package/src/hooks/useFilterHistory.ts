import { useCallback, useEffect } from "react";
import { useLocalStorage } from "@mantine/hooks";
import type { 
  ActiveFilter, 
  FilterHistory, 
  UseFilterHistoryOptions,
  UseFilterHistoryReturn 
} from "../types/filter.types";

export const useFilterHistory = (
  activeFilters: ActiveFilter[],
  options: UseFilterHistoryOptions = {}
): UseFilterHistoryReturn => {
  const { 
    storageKey = "filters-history", 
    maxHistory = 10,
    enabled = true 
  } = options;

  const [filterHistory, setFilterHistory] = useLocalStorage<FilterHistory[]>({
    key: storageKey,
    defaultValue: [],
  });

  // Add to history when filters change
  useEffect(() => {
    if (!enabled || activeFilters.length === 0) return;

    const newHistory: FilterHistory = {
      filters: activeFilters,
      timestamp: Date.now(),
    };

    setFilterHistory((prev) => {
      // Check if same filters already exist
      const filtered = prev.filter(
        (h) => JSON.stringify(h.filters) !== JSON.stringify(activeFilters)
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

