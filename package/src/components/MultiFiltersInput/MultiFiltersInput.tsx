import React, { useCallback, useMemo, useRef, useState } from "react";

import { ActionIcon, Badge, Box, Combobox, Tooltip, useCombobox, useMantineTheme } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import cx from "clsx";
import classes from "./MultiFiltersInput.module.css";

import { useFilterHistory } from "../../hooks/useFilterHistory";
import { useFilterPresets } from "../../hooks/useFilterPresets";
import type {
  ActiveFilter,
  FilterAction,
  FilterDefinition,
  FilterOperator,
  InputStep,
  MultiFiltersInputProps,
  MultiFiltersInputStyles,
  MultiFiltersInputClassNames,
} from "../../types/filter.types";
import { formatDate, formatDateRange, generateId, getOperatorsForField } from "../../utils";

import { CurrentFieldIndicator } from "./CurrentFieldIndicator";
import { FieldDropdown, OperatorDropdown, ValueDropdown } from "./dropdowns";
import { FilterActionsMenu } from "./FilterActionsMenu";
import { FilterMaxReached } from "./FilterMaxReached";
import { FilterPill } from "./FilterPill";
import { DateRangeValueInput, DateValueInput } from "./value-inputs";

export type FilterOverflowMode = "scroll" | "wrap";

export interface MultiFiltersInputExtendedProps extends MultiFiltersInputProps {
  /** Custom renderer for filter pills */
  renderPill?: (filter: ActiveFilter, onRemove: () => void) => React.ReactNode;
  /** Disable presets feature */
  disablePresets?: boolean;
  /** Disable history feature */
  disableHistory?: boolean;
  /** Storage key prefix for local storage */
  storageKeyPrefix?: string;
  /** Custom actions for the menu */
  customActions?: FilterAction[];
  /** Overflow mode: "scroll" for horizontal scrolling, "wrap" for line wrapping */
  overflowMode?: FilterOverflowMode;
  /** Custom placeholder for operator selection step */
  operatorPlaceholder?: string;
  /** Custom placeholder for value input step */
  valuePlaceholder?: string;
  /** Custom placeholder for options search step */
  searchPlaceholder?: string;
}

export const MultiFiltersInput: React.FC<MultiFiltersInputExtendedProps> = ({
  filters,
  value: activeFilters,
  onChange,
  placeholder = "Filter by...",
  maxFilters,
  className,
  renderPill,
  disablePresets = false,
  disableHistory = false,
  storageKeyPrefix = "filters",
  customActions = [],
  overflowMode = "scroll",
  styles,
  classNames,
  operatorPlaceholder = "Select operator...",
  valuePlaceholder = "Enter value...",
  searchPlaceholder = "Search options...",
  ...boxProps
}) => {
  const theme = useMantineTheme();
  
  // Resolve styles (can be object or function)
  const resolvedStyles: MultiFiltersInputStyles = useMemo(() => {
    return typeof styles === 'function' ? styles(theme) : (styles || {});
  }, [styles, theme]);

  // Merge default classNames with custom classNames
  const mergedClassNames: MultiFiltersInputClassNames = useMemo(() => {
    return {
      root: classNames?.root,
      container: classNames?.container,
      leftIcon: classNames?.leftIcon,
      pillsContainer: classNames?.pillsContainer,
      input: classNames?.input,
      rightSection: classNames?.rightSection,
      dropdown: classNames?.dropdown,
      badge: classNames?.badge,
      clearButton: classNames?.clearButton,
    };
  }, [classNames]);
  // Input state
  const [inputStep, setInputStep] = useState<InputStep>("field");
  const [selectedField, setSelectedField] = useState<FilterDefinition | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [dateRangeValue, setDateRangeValue] = useState<[Date | null, Date | null]>([null, null]);
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [_isFocused, setIsFocused] = useState(false);
  const [highlightedFilterId, setHighlightedFilterId] = useState<string | null>(null);
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [editingPart, setEditingPart] = useState<"field" | "operator" | "value" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);

  // Preferences from local storage
  const [isCompactMode, setIsCompactMode] = useLocalStorage({
    key: `${storageKeyPrefix}-compact-mode`,
    defaultValue: false,
  });
  const [showFilterCount, setShowFilterCount] = useLocalStorage({
    key: `${storageKeyPrefix}-show-count`,
    defaultValue: true,
  });

  // Presets hook
  const {
    presets: savedPresets,
    savePreset,
    loadPreset,
    toggleFavorite: togglePresetFavorite,
    deletePreset,
  } = useFilterPresets({
    storageKey: `${storageKeyPrefix}-saved-presets`,
    onLoad: onChange,
  });

  // History hook
  const { history: filterHistory } = useFilterHistory(activeFilters, {
    storageKey: `${storageKeyPrefix}-history`,
    enabled: !disableHistory,
  });

  // Combobox
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.selectFirstOption(),
  });

  // Computed values
  const availableFilters = useMemo(() => {
    const usedKeys = new Set(activeFilters.map((f) => f.key));
    return filters.filter((f) => !usedKeys.has(f.key));
  }, [filters, activeFilters]);

  const filteredFields = useMemo(() => {
    if (!inputValue.trim()) {
      return availableFilters;
    }
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

  // Keyboard shortcuts
  useHotkeys([
    ["mod+/", () => {
      inputRef.current?.focus();
      combobox.openDropdown();
      combobox.selectFirstOption();
    }],
    ["mod+Backspace", () => handleClearAll()],
  ]);

  // Actions
  const resetInput = useCallback(() => {
    setInputStep("field");
    setSelectedField(null);
    setSelectedOperator(null);
    setInputValue("");
    setDateValue(null);
    setDateRangeValue([null, null]);
    setMultiSelectValues([]);
    setEditingFilterId(null);
    setEditingPart(null);
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
    setEditingFilterId(null);
    setEditingPart(null);
  }, [onChange, resetInput]);


  const handleFilterOperatorClick = useCallback((filter: ActiveFilter) => {
    const field = filters.find((f) => f.key === filter.key);
    if (!field) {return;}
    
    setEditingFilterId(filter.id);
    setEditingPart("operator");
    setSelectedField(field);
    setSelectedOperator(filter.operator);
    setInputValue("");
    setDateValue(null);
    setDateRangeValue([null, null]);
    setMultiSelectValues([]);
    setInputStep("operator");
    // Open dropdown after state updates
    setTimeout(() => {
      combobox.openDropdown();
      combobox.selectFirstOption();
    }, 0);
  }, [filters, combobox]);

  const handleFilterValueClick = useCallback((filter: ActiveFilter) => {
    const field = filters.find((f) => f.key === filter.key);
    if (!field) {return;}
    
    setEditingFilterId(filter.id);
    setEditingPart("value");
    setSelectedField(field);
    setSelectedOperator(filter.operator);
    
    // Set value based on type
    if (field.type === "date") {
      const dateVal = typeof filter.value === "string" ? new Date(filter.value) : null;
      setDateValue(dateVal);
      setInputValue("");
    } else if (field.type === "date_range") {
      if (Array.isArray(filter.value) && filter.value.length === 2) {
        const range: [Date | null, Date | null] = [
          filter.value[0] instanceof Date ? filter.value[0] : (filter.value[0] ? new Date(filter.value[0] as string) : null),
          filter.value[1] instanceof Date ? filter.value[1] : (filter.value[1] ? new Date(filter.value[1] as string) : null),
        ];
        setDateRangeValue(range);
      } else {
        setDateRangeValue([null, null]);
      }
      setInputValue("");
    } else if (field.type === "multi_select") {
      const values = Array.isArray(filter.value) ? filter.value as string[] : [];
      setMultiSelectValues(values);
      setInputValue("");
    } else {
      const textValue = typeof filter.value === "string" ? filter.value : String(filter.value || "");
      setInputValue(textValue);
    }
    
    setInputStep("value");
    // Open dropdown for select/multi_select types after state updates
    if (field.type === "select" || field.type === "multi_select") {
      setTimeout(() => {
        combobox.openDropdown();
        combobox.selectFirstOption();
      }, 0);
    } else {
      // For text/number/email, focus the input
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [filters, combobox]);

  const handleFieldSelect = useCallback(
    (field: FilterDefinition) => {
      setSelectedField(field);
      setInputValue("");
      const operators = getOperatorsForField(field);
      
      if (editingFilterId && editingPart === "field") {
        // When editing field, check if we need to select operator
        if (operators.length === 1) {
          setSelectedOperator(operators[0]);
          // Clear existing values when changing field type
          setDateValue(null);
          setDateRangeValue([null, null]);
          setMultiSelectValues([]);
          setInputStep("value");
          // For select/multi_select, open dropdown
          if (field.type === "select" || field.type === "multi_select") {
            setTimeout(() => {
              combobox.openDropdown();
              combobox.selectFirstOption();
            }, 0);
          }
        } else {
          // Multiple operators available, show operator selection
          setDateValue(null);
          setDateRangeValue([null, null]);
          setMultiSelectValues([]);
          setInputStep("operator");
          setTimeout(() => {
            combobox.openDropdown();
            combobox.selectFirstOption();
          }, 0);
        }
      } else if (operators.length === 1) {
        // New filter creation with a single operator
        setSelectedOperator(operators[0]);
        setInputStep("value");
      } else {
        // New filter creation with multiple operators
        setInputStep("operator");
      }
    },
    [editingFilterId, editingPart, combobox]
  );

  const handleOperatorSelect = useCallback((operator: FilterOperator) => {
    setSelectedOperator(operator);
    
    if (editingFilterId && editingPart === "operator" && selectedField) {
      // When editing operator, try to preserve existing value and update immediately
      const existingFilter = activeFilters.find((f) => f.id === editingFilterId);
      if (existingFilter) {
        // Set the existing value back
        if (selectedField.type === "date") {
          const dateVal = typeof existingFilter.value === "string" ? new Date(existingFilter.value) : null;
          setDateValue(dateVal);
          // Update filter immediately if date value is valid
          if (dateVal) {
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    operator,
                    value: dateVal.toISOString(),
                    displayValue: formatDate(dateVal),
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
            return;
          }
        } else if (selectedField.type === "date_range") {
          if (Array.isArray(existingFilter.value) && existingFilter.value.length === 2) {
            const range: [Date | null, Date | null] = [
              existingFilter.value[0] instanceof Date ? existingFilter.value[0] : (existingFilter.value[0] ? new Date(existingFilter.value[0] as string) : null),
              existingFilter.value[1] instanceof Date ? existingFilter.value[1] : (existingFilter.value[1] ? new Date(existingFilter.value[1] as string) : null),
            ];
            setDateRangeValue(range);
            // Update filter immediately if date range is valid
            if (range[0] && range[1]) {
              const updatedFilters = activeFilters.map((f) =>
                f.id === editingFilterId
                  ? {
                      ...f,
                      operator,
                      value: range,
                      displayValue: formatDateRange(range[0], range[1]),
                    }
                  : f
              );
              onChange(updatedFilters);
              setEditingFilterId(null);
              setEditingPart(null);
              resetInput();
              return;
            }
          }
        } else if (selectedField.type === "multi_select") {
          const values = Array.isArray(existingFilter.value) ? existingFilter.value as string[] : [];
          setMultiSelectValues(values);
          // Update filter immediately if values exist
          if (values.length > 0) {
            const labels = values
              .map((v) => selectedField.options?.find((o) => o.value === v)?.label || v)
              .join(", ");
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    operator,
                    value: values,
                    displayValue: labels,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
            return;
          }
        } else if (selectedField.type === "select") {
          const textValue = typeof existingFilter.value === "string" ? existingFilter.value : String(existingFilter.value || "");
          setInputValue(textValue);
          // Update filter immediately if value exists
          if (textValue) {
            const option = selectedField.options?.find((o) => o.value === textValue);
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    operator,
                    value: textValue,
                    displayValue: option?.label || textValue,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
            return;
          }
        } else {
          // For text/email/number, update filter immediately with existing value
          const textValue = typeof existingFilter.value === "string" ? existingFilter.value : String(existingFilter.value || "");
          if (textValue) {
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    operator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
            return;
          }
        }
      }
    }
    
    setInputValue("");
    setInputStep("value");
    
    // If it's a select/multi_select, open dropdown
    if (selectedField && (selectedField.type === "select" || selectedField.type === "multi_select")) {
      combobox.openDropdown();
      combobox.selectFirstOption();
    }
  }, [editingFilterId, editingPart, activeFilters, selectedField, combobox, onChange, resetInput]);

  const addFilter = useCallback(
    (displayValue: string, rawValue: string | string[] | [Date | null, Date | null]) => {
      if (!selectedField || !selectedOperator) {return;}

      if (editingFilterId) {
        // Update existing filter
        const updatedFilters = activeFilters.map((f) =>
          f.id === editingFilterId
            ? {
                ...f,
                key: selectedField.key,
                label: selectedField.label,
                type: selectedField.type,
                operator: selectedOperator,
                value: rawValue,
                displayValue,
                icon: selectedField.icon,
              }
            : f
        );
        onChange(updatedFilters);
        setEditingFilterId(null);
        setEditingPart(null);
      } else {
        // Add new filter
        const newFilter: ActiveFilter = {
          id: generateId(),
          key: selectedField.key,
          label: selectedField.label,
          type: selectedField.type,
          operator: selectedOperator,
          value: rawValue,
          displayValue,
          icon: selectedField.icon,
        };

        onChange([...activeFilters, newFilter]);
        setHighlightedFilterId(newFilter.id);
        setTimeout(() => setHighlightedFilterId(null), 1000);
      }
      
      resetInput();
      
      // Scroll to end in scroll mode
      if (overflowMode === "scroll" && pillsContainerRef.current) {
        setTimeout(() => {
          if (pillsContainerRef.current) {
            pillsContainerRef.current.scrollLeft = pillsContainerRef.current.scrollWidth;
          }
        }, 50);
      }
    },
    [selectedField, selectedOperator, activeFilters, onChange, resetInput, overflowMode, editingFilterId]
  );

  const handleValueSubmit = useCallback(() => {
    if (!selectedField || !selectedOperator) {return;}

    // If editing, update the existing filter directly
    if (editingFilterId && editingPart === "value") {
      switch (selectedField.type) {
        case "text":
        case "email":
        case "number":
          if (inputValue.trim()) {
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    value: inputValue.trim(),
                    displayValue: inputValue.trim(),
                    operator: selectedOperator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
          }
          return;
        case "date":
          if (dateValue) {
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    value: dateValue.toISOString(),
                    displayValue: formatDate(dateValue),
                    operator: selectedOperator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
          }
          return;
        case "date_range":
          if (dateRangeValue[0] && dateRangeValue[1]) {
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    value: dateRangeValue,
                    displayValue: formatDateRange(dateRangeValue[0], dateRangeValue[1]),
                    operator: selectedOperator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
          }
          return;
        case "select":
          if (inputValue) {
            const option = selectedField.options?.find((o) => o.value === inputValue);
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    value: inputValue,
                    displayValue: option?.label || inputValue,
                    operator: selectedOperator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
          }
          return;
        case "multi_select":
          if (multiSelectValues.length > 0) {
            const labels = multiSelectValues
              .map((v) => selectedField.options?.find((o) => o.value === v)?.label || v)
              .join(", ");
            const updatedFilters = activeFilters.map((f) =>
              f.id === editingFilterId
                ? {
                    ...f,
                    value: multiSelectValues,
                    displayValue: labels,
                    operator: selectedOperator,
                  }
                : f
            );
            onChange(updatedFilters);
            setEditingFilterId(null);
            setEditingPart(null);
            resetInput();
          }
          return;
      }
    }

    // Otherwise, use addFilter (for new filters)
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
          addFilter(formatDate(dateValue), dateValue.toISOString());
        }
        break;
      case "date_range":
        if (dateRangeValue[0] && dateRangeValue[1]) {
          addFilter(formatDateRange(dateRangeValue[0], dateRangeValue[1]), dateRangeValue);
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
  }, [selectedField, selectedOperator, inputValue, dateValue, dateRangeValue, multiSelectValues, addFilter, editingFilterId, editingPart, activeFilters, onChange, resetInput]);

  const handleOptionSelect = useCallback(
    (value: string) => {
      if (!selectedField) {return;}
      if (selectedField.type === "multi_select") {
        setMultiSelectValues((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
      } else {
        const option = selectedField.options?.find((o) => o.value === value);
        // Explicitly check if we're editing and preserve editingFilterId
        if (editingFilterId && editingPart === "value" && selectedOperator) {
          // Update existing filter directly
          const updatedFilters = activeFilters.map((f) =>
            f.id === editingFilterId
              ? {
                  ...f,
                  value,
                  displayValue: option?.label || value,
                  operator: selectedOperator,
                }
              : f
          );
          onChange(updatedFilters);
          setEditingFilterId(null);
          setEditingPart(null);
          resetInput();
        } else {
          addFilter(option?.label || value, value);
        }
      }
    },
    [selectedField, addFilter, editingFilterId, editingPart, selectedOperator, activeFilters, onChange, resetInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && inputStep === "value") {
        e.preventDefault();
        if (selectedField?.type === "multi_select" && multiSelectValues.length > 0) {
          handleValueSubmit();
        } else if (["text", "email", "number"].includes(selectedField?.type || "")) {
          handleValueSubmit();
        }
      }
      if (e.key === "Escape") {
        resetInput();
        combobox.closeDropdown();
      }
      if (e.key === "Backspace" && !inputValue && inputStep === "field" && activeFilters.length > 0) {
        handleRemoveFilter(activeFilters[activeFilters.length - 1].id);
      }
    },
    [inputStep, selectedField, multiSelectValues, handleValueSubmit, inputValue, activeFilters, resetInput, combobox, handleRemoveFilter]
  );

  const handleSavePreset = useCallback(() => {
    savePreset(activeFilters);
  }, [activeFilters, savePreset]);

  // Determine what to show
  const showDropdown =
    inputStep === "field" ||
    inputStep === "operator" ||
    (inputStep === "value" && (selectedField?.type === "select" || selectedField?.type === "multi_select"));

  const shouldShowDateInput =
    inputStep === "value" && (selectedField?.type === "date" || selectedField?.type === "date_range");

  const getInputPlaceholder = () => {
    if (inputStep === "field") {return placeholder;}
    if (inputStep === "operator") {return operatorPlaceholder;}
    if (inputStep === "value") {
      if (selectedField?.type === "select" || selectedField?.type === "multi_select") {
        return searchPlaceholder;
      }
      return selectedField?.placeholder || valuePlaceholder;
    }
    return placeholder;
  };

  // Render value input based on field type
  const renderValueInput = () => {
    if (!selectedField || inputStep !== "value") {return null;}

    switch (selectedField.type) {
      case "date":
        return (
          <DateValueInput
            value={dateValue}
            onChange={setDateValue}
            onComplete={addFilter}
            onCancel={resetInput}
          />
        );
      case "date_range":
        return (
          <DateRangeValueInput
            value={dateRangeValue}
            onChange={setDateRangeValue}
            onComplete={addFilter}
            onCancel={resetInput}
          />
        );
      default:
        return null;
    }
  };

  // Render dropdown content based on step
  const renderDropdownContent = () => {
    if (inputStep === "field") {
      return (
        <FieldDropdown
          fields={filteredFields}
        />
      );
    }

    if (inputStep === "operator" && selectedField) {
      return (
        <OperatorDropdown
          field={selectedField}
        />
      );
    }

    if (inputStep === "value" && selectedField) {
      return (
        <ValueDropdown
          field={selectedField}
          options={filteredOptions}
          selectedValues={multiSelectValues}
          onSubmit={handleValueSubmit}
        />
      );
    }

    return null;
  };

  return (
    <Box 
      className={cx(mergedClassNames.root, className)} 
      style={{ ...resolvedStyles.root, ...boxProps.style }}
      {...boxProps}
    >
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          if (inputStep === "field") {
            const field = filters.find((f) => f.key === val);
            if (field) {
              handleFieldSelect(field);
            }
          } else if (inputStep === "operator") {
            handleOperatorSelect(val as FilterOperator);
          } else if (inputStep === "value") {
            handleOptionSelect(val);
          }
        }}
        position="bottom-start"
        offset={4}
        middlewares={{ flip: true, shift: true }}
        withinPortal
      >
        <Combobox.DropdownTarget>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              // Only handle Enter/Space when target is not an input (allow typing in inputs)
              const isInput = (e.target as HTMLElement).tagName === "INPUT";
              if ((e.key === "Enter" || e.key === " ") && !isInput) {
                e.preventDefault();
                if (!isInputDisabled) {
                  combobox.openDropdown();
                  combobox.selectFirstOption();
                }
              }
            }}
            className={cx(classes.container, mergedClassNames.container)}
            style={resolvedStyles.container}
          >
            {/* Left Icon */}
            <ActionIcon 
              color="gray" 
              variant="subtle" 
              size="md"
              pl="xs"
              className={mergedClassNames.leftIcon}
              style={resolvedStyles.leftIcon}
            >
              <IconSearch size={16} />
            </ActionIcon>
            {/* Pills & Input */}
            <div 
              ref={pillsContainerRef}
              className={cx(
                classes.pillsContainer,
                overflowMode === "scroll" ? classes.pillsContainerScroll : classes.pillsContainerWrap,
                mergedClassNames.pillsContainer
              )}
              style={resolvedStyles.pillsContainer}
            >
              {activeFilters.map((filter) => (
                renderPill ? (
                  renderPill(filter, () => handleRemoveFilter(filter.id))
                ) : (
                  <FilterPill
                    key={filter.id}
                    filter={filter}
                    onRemove={handleRemoveFilter}
                    onOperatorClick={handleFilterOperatorClick}
                    onValueClick={handleFilterValueClick}
                    isHighlighted={highlightedFilterId === filter.id}
                    isCompact={isCompactMode}
                  />
                )
              ))}

              {inputStep !== "field" && selectedField && (
                <CurrentFieldIndicator
                  field={selectedField}
                  operator={selectedOperator}
                  showValueIndicator={inputStep === "value" && !shouldShowDateInput}
                  isCompact={isCompactMode}
                />
              )}

              {shouldShowDateInput ? (
                renderValueInput()
              ) : (
                <Combobox.EventsTarget>
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.currentTarget.value);
                      combobox.openDropdown();
                      combobox.selectFirstOption();
                    }}
                    onFocus={() => {
                      setIsFocused(true);
                      combobox.openDropdown();
                      combobox.selectFirstOption();
                      if (overflowMode === "scroll" && pillsContainerRef.current && inputRef.current) {
                        // Scroll input to center of visible area
                        const container = pillsContainerRef.current;
                        const input = inputRef.current;
                        const containerRect = container.getBoundingClientRect();
                        const inputRect = input.getBoundingClientRect();
                        const inputLeft = inputRect.left - containerRect.left + container.scrollLeft;
                        const inputWidth = inputRect.width;
                        const containerWidth = containerRect.width;
                        const scrollPosition = inputLeft - (containerWidth / 2) + (inputWidth / 2);
                        container.scrollTo({
                          left: Math.max(0, scrollPosition),
                          behavior: 'smooth'
                        });
                      }
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                      combobox.closeDropdown();
                      if (overflowMode === "scroll" && pillsContainerRef.current) {
                        // Scroll back to start
                        pillsContainerRef.current.scrollTo({
                          left: 0,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={getInputPlaceholder()}
                    disabled={isInputDisabled}
                    className={cx(classes.input, mergedClassNames.input)}
                    style={resolvedStyles.input}
                  />
                </Combobox.EventsTarget>
              )}
            </div>

            {/* Right Section */}
            <div 
              className={cx(classes.rightSection, mergedClassNames.rightSection)}
              style={resolvedStyles.rightSection}
            >
              {activeFilters.length > 0 && (
                <>
                  {showFilterCount && (
                    <Badge 
                      variant="filled" 
                      size="xs"
                      className={mergedClassNames.badge}
                      style={resolvedStyles.badge}
                    >
                      {activeFilters.length}
                    </Badge>
                  )}
                  <Tooltip label="Clear all (⌘+⌫)" withArrow>
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="sm"
                      className={mergedClassNames.clearButton}
                      style={resolvedStyles.clearButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAll();
                      }}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Tooltip>
                </>
              )}

              <FilterActionsMenu
                activeFilters={activeFilters}
                onChange={onChange}
                isCompactMode={isCompactMode}
                setIsCompactMode={setIsCompactMode}
                showFilterCount={showFilterCount}
                setShowFilterCount={setShowFilterCount}
                savedPresets={savedPresets}
                onSavePreset={handleSavePreset}
                onLoadPreset={loadPreset}
                onTogglePresetFavorite={togglePresetFavorite}
                onDeletePreset={deletePreset}
                filterHistory={filterHistory}
                customActions={customActions}
                disablePresets={disablePresets}
                disableHistory={disableHistory}
              />

            
            </div>
          </div>
        </Combobox.DropdownTarget>

        {showDropdown && (
          <Combobox.Dropdown 
            className={cx(classes.dropdown, mergedClassNames.dropdown)}
            style={resolvedStyles.dropdown}
          >
            {renderDropdownContent()}
          </Combobox.Dropdown>
        )}
      </Combobox>

      {maxFilters !== undefined && activeFilters.length >= maxFilters && (
        <FilterMaxReached maxFilters={maxFilters} />
      )}

      {/* <FilterStatusBar
        activeCount={activeFilters.length}
        maxFilters={maxFilters}
        onRefresh={() => onChange([...activeFilters])}
      /> */}
    </Box>
  );
};

export default MultiFiltersInput;

