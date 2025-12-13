import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import type {
  ActiveFilter,
  FilterDefinition,
  FilterInputContextType,
  FilterOperator,
  InputStep,
} from "../../../types/filter.types";
import { generateId, formatDate, formatDateRange, getOperatorsForField } from "../../../utils";


const FilterInputContext = createContext<FilterInputContextType | null>(null);

export interface FilterProviderProps {
  children: React.ReactNode;
  filters: FilterDefinition[];
  activeFilters: ActiveFilter[];
  onChange: (filters: ActiveFilter[]) => void;
  maxFilters?: number;
  placeholder?: string;
  storageKeyPrefix?: string;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  filters,
  activeFilters,
  onChange,
  maxFilters,
  placeholder = "Filter by...",
  storageKeyPrefix = "filters",
}) => {
  // Input state
  const [inputStep, setInputStep] = useState<InputStep>("field");
  const [selectedField, setSelectedField] = useState<FilterDefinition | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [dateRangeValue, setDateRangeValue] = useState<[Date | null, Date | null]>([null, null]);
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedFilterId, setHighlightedFilterId] = useState<string | null>(null);

  // Preferences
  const [isCompactMode, setIsCompactMode] = useLocalStorage({
    key: `${storageKeyPrefix}-compact-mode`,
    defaultValue: false,
  });
  const [showFilterCount, setShowFilterCount] = useLocalStorage({
    key: `${storageKeyPrefix}-show-count`,
    defaultValue: true,
  });

  // Computed values
  const availableFilters = useMemo(() => {
    const usedKeys = new Set(activeFilters.map((f) => f.key));
    return filters.filter((f) => !usedKeys.has(f.key));
  }, [filters, activeFilters]);

  const filteredFields = useMemo(() => {
    if (!inputValue.trim()) {return availableFilters;}
    return availableFilters.filter((f) =>
      f.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [availableFilters, inputValue]);

  const filteredOptions = useMemo(() => {
    if (!selectedField?.options) {return [];}
    if (!inputValue.trim()) {return selectedField.options;}
    return selectedField.options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [selectedField, inputValue]);

  const isInputDisabled = maxFilters !== undefined && activeFilters.length >= maxFilters;

  // Actions
  const resetInput = useCallback(() => {
    setInputStep("field");
    setSelectedField(null);
    setSelectedOperator(null);
    setInputValue("");
    setDateValue(null);
    setDateRangeValue([null, null]);
    setMultiSelectValues([]);
  }, []);

  const handleRemoveFilter = useCallback(
    (id: string) => {
      onChange(activeFilters.filter((f) => f.id !== id));
    },
    [activeFilters, onChange]
  );

  const handleClearAll = useCallback(() => {
    onChange([]);
    resetInput();
  }, [onChange, resetInput]);

  const handleFieldSelect = useCallback(
    (field: FilterDefinition) => {
      setSelectedField(field);
      setInputValue("");

      const operators = getOperatorsForField(field);
      if (operators.length === 1) {
        setSelectedOperator(operators[0]);
        setInputStep("value");
      } else {
        setInputStep("operator");
      }
    },
    []
  );

  const handleOperatorSelect = useCallback((operator: FilterOperator) => {
    setSelectedOperator(operator);
    setInputStep("value");
    setInputValue("");
  }, []);

  const addFilter = useCallback(
    (displayValue: string, rawValue: string | string[] | [Date | null, Date | null]) => {
      if (!selectedField || !selectedOperator) {return;}

      const newFilter: ActiveFilter = {
        id: generateId(),
        key: selectedField.key,
        label: selectedField.label,
        type: selectedField.type,
        operator: selectedOperator,
        value: rawValue,
        displayValue,
      };

      onChange([...activeFilters, newFilter]);
      setHighlightedFilterId(newFilter.id);
      setTimeout(() => setHighlightedFilterId(null), 1000);
      resetInput();
    },
    [selectedField, selectedOperator, activeFilters, onChange, resetInput]
  );

  const handleValueSubmit = useCallback(() => {
    if (!selectedField || !selectedOperator) {return;}

    switch (selectedField.type) {
      case "text":
      case "email":
      case "number":
        if (inputValue.trim()) {
          addFilter(inputValue.trim(), inputValue.trim());
        }
        break;

      case "date":
        if (dateValue) {
          const formatted = formatDate(dateValue);
          addFilter(formatted, dateValue.toISOString());
        }
        break;

      case "date_range":
        if (dateRangeValue[0] && dateRangeValue[1]) {
          const formatted = formatDateRange(dateRangeValue[0], dateRangeValue[1]);
          addFilter(formatted, dateRangeValue);
        }
        break;

      case "select":
        if (inputValue) {
          const option = selectedField.options?.find((o) => o.value === inputValue);
          addFilter(option?.label || inputValue, inputValue);
        }
        break;

      case "multi_select":
        if (multiSelectValues.length > 0) {
          const labels = multiSelectValues
            .map((v) => selectedField.options?.find((o) => o.value === v)?.label || v)
            .join(", ");
          addFilter(labels, multiSelectValues);
        }
        break;
    }
  }, [selectedField, selectedOperator, inputValue, dateValue, dateRangeValue, multiSelectValues, addFilter]);

  const handleOptionSelect = useCallback(
    (value: string) => {
      if (!selectedField) {return;}

      if (selectedField.type === "multi_select") {
        setMultiSelectValues((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
      } else {
        const option = selectedField.options?.find((o) => o.value === value);
        addFilter(option?.label || value, value);
      }
    },
    [selectedField, addFilter]
  );

  const contextValue: FilterInputContextType = {
    // State
    inputStep,
    selectedField,
    selectedOperator,
    inputValue,
    dateValue,
    dateRangeValue,
    multiSelectValues,
    isFocused,
    highlightedFilterId,
    // Actions
    setInputStep,
    setSelectedField,
    setSelectedOperator,
    setInputValue,
    setDateValue,
    setDateRangeValue,
    setMultiSelectValues,
    setIsFocused,
    setHighlightedFilterId,
    resetInput,
    handleFieldSelect,
    handleOperatorSelect,
    handleValueSubmit,
    handleOptionSelect,
    handleRemoveFilter,
    handleClearAll,
    addFilter,
    // Props
    filters,
    activeFilters,
    onChange,
    availableFilters,
    filteredFields,
    filteredOptions,
    isInputDisabled,
    maxFilters,
    placeholder,
    // Preferences
    isCompactMode,
    setIsCompactMode,
    showFilterCount,
    setShowFilterCount,
  };

  return (
    <FilterInputContext.Provider value={contextValue}>
      {children}
    </FilterInputContext.Provider>
  );
};

export const useFilterContext = (): FilterInputContextType => {
  const context = useContext(FilterInputContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};

export default FilterInputContext;

