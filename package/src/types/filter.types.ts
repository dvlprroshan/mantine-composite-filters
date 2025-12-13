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

export type CompositeFiltersInputStylesNames = 
  | 'root'
  | 'container'
  | 'leftIcon'
  | 'pillsContainer'
  | 'input'
  | 'rightSection'
  | 'dropdown'
  | 'badge'
  | 'clearButton';

export interface CompositeFiltersInputStyles {
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

export interface CompositeFiltersInputClassNames {
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

export interface CompositeFiltersInputProps extends Omit<BoxProps, 'children'> {
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
  styles?: CompositeFiltersInputStyles | ((theme: any) => CompositeFiltersInputStyles);
  /** ClassNames applied to different parts of the component */
  classNames?: CompositeFiltersInputClassNames;
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

// Hook Options Types
export interface UseFiltersOptions {
  initialFilters?: ActiveFilter[];
  onFiltersChange?: (filters: ActiveFilter[]) => void;
}

export interface UseFilterPresetsOptions {
  storageKey?: string;
  onLoad?: (filters: ActiveFilter[]) => void;
}

export interface UseFilterHistoryOptions {
  storageKey?: string;
  maxHistory?: number;
  enabled?: boolean;
}

// Hook Return Types
export interface UseFiltersReturn {
  activeFilters: ActiveFilter[];
  setActiveFilters: (filters: ActiveFilter[]) => void;
  filterDefinitions: FilterDefinition[];
  addFilter: (filter: Omit<ActiveFilter, "id">) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  updateFilter: (id: string, updates: Partial<ActiveFilter>) => void;
  getFilterByKey: (key: string) => ActiveFilter | undefined;
  hasFilter: (key: string) => boolean;
  toQueryParams: Record<string, string | string[]>;
  toApiFormat: Array<{ field: string; operator: FilterOperator; value: ActiveFilter["value"] }>;
  filtersCount: number;
}

export interface UseFilterPresetsReturn {
  presets: SavedFilterPreset[];
  sortedPresets: SavedFilterPreset[];
  savePreset: (filters: ActiveFilter[], name?: string) => SavedFilterPreset | null;
  loadPreset: (preset: SavedFilterPreset) => void;
  toggleFavorite: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  updatePreset: (presetId: string, updates: Partial<Omit<SavedFilterPreset, "id">>) => void;
  hasPresets: boolean;
}

export interface UseFilterHistoryReturn {
  history: FilterHistory[];
  recentHistory: FilterHistory[];
  clearHistory: () => void;
  removeHistoryItem: (timestamp: number) => void;
  hasHistory: boolean;
}

// API Filter Format
export interface ApiFilterFormat {
  field: string;
  operator: FilterOperator;
  value: ActiveFilter["value"];
}

// Filter Value Types
export type FilterValue = string | string[] | [Date | null, Date | null];

// Pill Props for custom rendering
export interface FilterPillProps {
  filter: ActiveFilter;
  onRemove: (id: string) => void;
  onOperatorClick?: (filter: ActiveFilter) => void;
  onValueClick?: (filter: ActiveFilter) => void;
  isHighlighted?: boolean;
  isCompact?: boolean;
}

