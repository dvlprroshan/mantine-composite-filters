// Components
export { default as MultiFiltersInput } from "./components/MultiFiltersInput";
export {
  MultiFiltersInput as MultiFiltersInputComponent,
  FilterPill,
  CurrentFieldIndicator,
  FilterActionsMenu,
  FilterStatusBar,
  FilterMaxReached,
  FieldDropdown,
  OperatorDropdown,
  ValueDropdown,
  DateValueInput,
  DateRangeValueInput,
  FilterProvider,
  useFilterContext,
  // Styles API
  multiFiltersInputClasses,
  multiFiltersInputStaticClasses,
} from "./components/MultiFiltersInput";
export type { FilterOverflowMode, MultiFiltersInputExtendedProps } from "./components/MultiFiltersInput/MultiFiltersInput";
export type { MultiFiltersInputStylesNames as MultiFiltersInputStylesNamesType } from "./components/MultiFiltersInput/MultiFiltersInput.classes";

// Hooks
export { useFilters } from "./hooks/useFilters";
export { useFilterPresets } from "./hooks/useFilterPresets";
export { useFilterHistory } from "./hooks/useFilterHistory";

// Utils
export * from "./utils";

// Types
export type {
  // Core types
  ActiveFilter,
  FilterDefinition,
  FilterOperator,
  FilterOption,
  FilterType,
  FilterValue,
  FilterVariant,
  
  // Component props types
  MultiFiltersInputProps,
  MultiFiltersInputStylesNames,
  MultiFiltersInputStyles,
  MultiFiltersInputClassNames,
  FilterPillProps,
  
  // Dropdown types
  FilterDropdownConfig,
  FieldDropdownProps,
  OperatorDropdownProps,
  ValueDropdownProps,
  
  // State types
  InputStep,
  FilterInputState,
  FilterInputActions,
  FilterInputContextType,
  
  // Storage types
  SavedFilterPreset,
  FilterHistory,
  
  // Hook options types
  UseFiltersOptions,
  UseFilterPresetsOptions,
  UseFilterHistoryOptions,
  
  // Hook return types
  UseFiltersReturn,
  UseFilterPresetsReturn,
  UseFilterHistoryReturn,
  
  // API types
  ApiFilterFormat,
  FilterAction,
} from "./types/filter.types";
