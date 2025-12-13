// Components
export { default as CompositeFiltersInput } from "./components/CompositeFiltersInput";
export {
  CompositeFiltersInput as CompositeFiltersInputComponent,
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
  CompositeFiltersInputClasses,
  CompositeFiltersInputStaticClasses,
} from "./components/CompositeFiltersInput";
export type { FilterOverflowMode, CompositeFiltersInputExtendedProps } from "./components/CompositeFiltersInput/CompositeFiltersInput";
export type { CompositeFiltersInputStylesNames as CompositeFiltersInputStylesNamesType } from "./components/CompositeFiltersInput/CompositeFiltersInput.classes";

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
  CompositeFiltersInputProps,
  CompositeFiltersInputStylesNames,
  CompositeFiltersInputStyles,
  CompositeFiltersInputClassNames,
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
