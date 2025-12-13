// Main component
export { CompositeFiltersInput as default } from "./CompositeFiltersInput";
export { CompositeFiltersInput } from "./CompositeFiltersInput";
export type { CompositeFiltersInputExtendedProps } from "./CompositeFiltersInput";

// export back compatibility support for version 0.2.0 and lower
export { CompositeFiltersInput as MultiFiltersInput } from "./CompositeFiltersInput";

// Styles API
export { 
  CompositeFiltersInputClasses,
  staticClasses as CompositeFiltersInputStaticClasses,
  type CompositeFiltersInputStylesNames 
} from "./CompositeFiltersInput.classes";

// Sub-components for customization
export { FilterPill } from "./FilterPill";
export { CurrentFieldIndicator } from "./CurrentFieldIndicator";
export { FilterActionsMenu } from "./FilterActionsMenu";
export { FilterStatusBar } from "./FilterStatusBar";
export { FilterMaxReached } from "./FilterMaxReached";

// Dropdowns
export * from "./dropdowns";

// Value inputs
export * from "./value-inputs";

// Context (for advanced usage)
export * from "./context";

