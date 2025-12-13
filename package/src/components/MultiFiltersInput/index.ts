export {CompositeFiltersInput as default} from "../CompositeFiltersInput";
export { CompositeFiltersInput as MultiFiltersInput } from "../CompositeFiltersInput";

// Styles API
export { 
    CompositeFiltersInputClasses as MultiFiltersInputClasses,
    staticClasses as MultiFiltersInputStaticClasses,
    type CompositeFiltersInputStylesNames as MultiFiltersInputStylesNames 
  } from "../CompositeFiltersInput/CompositeFiltersInput.classes";
  
  // Sub-components for customization
  export { FilterPill } from "../CompositeFiltersInput/FilterPill";
  export { CurrentFieldIndicator } from "../CompositeFiltersInput/CurrentFieldIndicator";
  export { FilterActionsMenu } from "../CompositeFiltersInput/FilterActionsMenu";
  export { FilterStatusBar } from "../CompositeFiltersInput/FilterStatusBar";
  export { FilterMaxReached } from "../CompositeFiltersInput/FilterMaxReached";
  
  // Dropdowns
  export * from "../CompositeFiltersInput/dropdowns";
  
  // Value inputs
  export * from "../CompositeFiltersInput/value-inputs";
  
  // Context (for advanced usage)
  export * from "../CompositeFiltersInput/context";