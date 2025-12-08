import React from "react";
import type { BoxProps } from "@mantine/core";

export type FilterType = 
  | 'text' 
  | 'date' 
  | 'date_range' 
  | 'email' 
  | 'number' 
  | 'select' 
  | 'multi_select';

export type FilterOperator = 
  | '=' 
  | '!=' 
  | '>' 
  | '<' 
  | '>=' 
  | '<=' 
  | 'contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'between';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  operators?: FilterOperator[];
  defaultOperator?: FilterOperator;
  icon?: React.ReactNode;
}

export interface ActiveFilter {
  id: string;
  key: string;
  label: string;
  type: FilterType;
  operator: FilterOperator;
  value: string | string[] | [Date | null, Date | null];
  displayValue: string;
  icon?: React.ReactNode;
}

export type MultiFiltersInputStylesNames = 
  | 'root'
  | 'container'
  | 'leftIcon'
  | 'pillsContainer'
  | 'input'
  | 'rightSection'
  | 'dropdown'
  | 'badge'
  | 'clearButton';

export interface MultiFiltersInputStyles {
  root?: React.CSSProperties;
  container?: React.CSSProperties;
  leftIcon?: React.CSSProperties;
  pillsContainer?: React.CSSProperties;
  input?: React.CSSProperties;
  rightSection?: React.CSSProperties;
  dropdown?: React.CSSProperties;
  badge?: React.CSSProperties;
  clearButton?: React.CSSProperties;
}

export interface MultiFiltersInputClassNames {
  root?: string;
  container?: string;
  leftIcon?: string;
  pillsContainer?: string;
  input?: string;
  rightSection?: string;
  dropdown?: string;
  badge?: string;
  clearButton?: string;
}

export interface MultiFiltersInputProps extends Omit<BoxProps, 'children'> {
  filters: FilterDefinition[];
  value: ActiveFilter[];
  onChange: (filters: ActiveFilter[]) => void;
  placeholder?: string;
  maxFilters?: number;
  className?: string;
  /** Custom renderer for filter pills */
  renderPill?: (filter: ActiveFilter, onRemove: () => void) => React.ReactNode;
  /** Custom dropdown components */
  customDropdowns?: Partial<FilterDropdownConfig>;
  /** Disable presets feature */
  disablePresets?: boolean;
  /** Disable history feature */
  disableHistory?: boolean;
  /** Storage key prefix for local storage */
  storageKeyPrefix?: string;
  /** Custom actions for the menu */
  customActions?: FilterAction[];
  /** Variants for different UI styles */
  variant?: FilterVariant;
  /** Styles applied to different parts of the component */
  styles?: MultiFiltersInputStyles | ((theme: any) => MultiFiltersInputStyles);
  /** ClassNames applied to different parts of the component */
  classNames?: MultiFiltersInputClassNames;
}

// Input step state
export type InputStep = "field" | "operator" | "value";

// Saved preset structure
export interface SavedFilterPreset {
  id: string;
  name: string;
  filters: ActiveFilter[];
  createdAt: number;
  isFavorite?: boolean;
}

// Filter history entry
export interface FilterHistory {
  filters: ActiveFilter[];
  timestamp: number;
}

// Context state type
export interface FilterInputState {
  inputStep: InputStep;
  selectedField: FilterDefinition | null;
  selectedOperator: FilterOperator | null;
  inputValue: string;
  dateValue: Date | null;
  dateRangeValue: [Date | null, Date | null];
  multiSelectValues: string[];
  isFocused: boolean;
  highlightedFilterId: string | null;
}

// Context actions type
export interface FilterInputActions {
  setInputStep: (step: InputStep) => void;
  setSelectedField: (field: FilterDefinition | null) => void;
  setSelectedOperator: (operator: FilterOperator | null) => void;
  setInputValue: (value: string) => void;
  setDateValue: (date: Date | null) => void;
  setDateRangeValue: (range: [Date | null, Date | null]) => void;
  setMultiSelectValues: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFocused: (focused: boolean) => void;
  setHighlightedFilterId: (id: string | null) => void;
  resetInput: () => void;
  handleFieldSelect: (field: FilterDefinition) => void;
  handleOperatorSelect: (operator: FilterOperator) => void;
  handleValueSubmit: () => void;
  handleOptionSelect: (value: string) => void;
  handleRemoveFilter: (id: string) => void;
  handleClearAll: () => void;
  addFilter: (displayValue: string, rawValue: string | string[] | [Date | null, Date | null]) => void;
}

// Full context type
export interface FilterInputContextType extends FilterInputState, FilterInputActions {
  filters: FilterDefinition[];
  activeFilters: ActiveFilter[];
  onChange: (filters: ActiveFilter[]) => void;
  availableFilters: FilterDefinition[];
  filteredFields: FilterDefinition[];
  filteredOptions: FilterOption[];
  isInputDisabled: boolean;
  maxFilters?: number;
  placeholder: string;
  isCompactMode: boolean;
  setIsCompactMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  showFilterCount: boolean;
  setShowFilterCount: (value: boolean | ((prev: boolean) => boolean)) => void;
}

// Dropdown configuration for customization
export interface FilterDropdownConfig {
  field: React.ComponentType<FieldDropdownProps>;
  operator: React.ComponentType<OperatorDropdownProps>;
  value: React.ComponentType<ValueDropdownProps>;
}

export interface FieldDropdownProps {
  fields: FilterDefinition[];
  onSelect: (field: FilterDefinition) => void;
  inputValue: string;
}

export interface OperatorDropdownProps {
  field: FilterDefinition;
  onSelect: (operator: FilterOperator) => void;
}

export interface ValueDropdownProps {
  field: FilterDefinition;
  operator: FilterOperator;
  options: FilterOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  onSubmit: () => void;
  inputValue: string;
}

// Custom action for menu extension
export interface FilterAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

// UI Variants
export type FilterVariant = "default" | "compact" | "minimal" | "bordered";

