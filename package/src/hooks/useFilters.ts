import { useCallback, useMemo, useState } from "react";
import type { ActiveFilter, FilterDefinition } from "../types/filter.types";

interface UseFiltersOptions {
  initialFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
}

export const useFilters = (filterDefinitions: FilterDefinition[], options?: UseFiltersOptions) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(
    options?.initialFilters || []
  );

  const handleFiltersChange = useCallback(
    (newFilters: ActiveFilter[]) => {
      setActiveFilters(newFilters);
      options?.onFiltersChange?.(newFilters);
    },
    [options]
  );

  const addFilter = useCallback(
    (filter: Omit<ActiveFilter, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newFilter: ActiveFilter = { ...filter, id };
      handleFiltersChange([...activeFilters, newFilter]);
    },
    [activeFilters, handleFiltersChange]
  );

  const removeFilter = useCallback(
    (id: string) => {
      handleFiltersChange(activeFilters.filter((f) => f.id !== id));
    },
    [activeFilters, handleFiltersChange]
  );

  const clearFilters = useCallback(() => {
    handleFiltersChange([]);
  }, [handleFiltersChange]);

  const updateFilter = useCallback(
    (id: string, updates: Partial<ActiveFilter>) => {
      handleFiltersChange(
        activeFilters.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    [activeFilters, handleFiltersChange]
  );

  const getFilterByKey = useCallback(
    (key: string) => activeFilters.find((f) => f.key === key),
    [activeFilters]
  );

  const hasFilter = useCallback(
    (key: string) => activeFilters.some((f) => f.key === key),
    [activeFilters]
  );

  // Convert active filters to query params format
  const toQueryParams = useMemo(() => {
    const params: Record<string, string | string[]> = {};
    activeFilters.forEach((filter) => {
      const paramKey = `filter[${filter.key}][${filter.operator}]`;
      if (Array.isArray(filter.value)) {
        if (filter.type === "date_range") {
          const [start, end] = filter.value as [Date | null, Date | null];
          if (start) params[`${filter.key}_start`] = start.toISOString().split("T")[0];
          if (end) params[`${filter.key}_end`] = end.toISOString().split("T")[0];
        } else {
          params[paramKey] = filter.value as string[];
        }
      } else {
        params[paramKey] = filter.value as string;
      }
    });
    return params;
  }, [activeFilters]);

  // Convert to API filter format
  const toApiFormat = useMemo(() => {
    return activeFilters.map((filter) => ({
      field: filter.key,
      operator: filter.operator,
      value: filter.value,
    }));
  }, [activeFilters]);

  return {
    activeFilters,
    setActiveFilters: handleFiltersChange,
    filterDefinitions,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
    getFilterByKey,
    hasFilter,
    toQueryParams,
    toApiFormat,
    filtersCount: activeFilters.length,
  };
};

