import classes from './CompositeFiltersInput.module.css';
import type { CompositeFiltersInputStylesNames } from '../../types/filter.types';

export type { CompositeFiltersInputStylesNames };

// Static class names following Mantine pattern: .mantine-{ComponentName}-{selector}
export const COMPONENT_NAME = 'CompositeFiltersInput';

export const staticClasses: Record<CompositeFiltersInputStylesNames, string> = {
  root: `mantine-${COMPONENT_NAME}-root`,
  container: `mantine-${COMPONENT_NAME}-container`,
  leftIcon: `mantine-${COMPONENT_NAME}-leftIcon`,
  pillsContainer: `mantine-${COMPONENT_NAME}-pillsContainer`,
  input: `mantine-${COMPONENT_NAME}-input`,
  rightSection: `mantine-${COMPONENT_NAME}-rightSection`,
  dropdown: `mantine-${COMPONENT_NAME}-dropdown`,
  badge: `mantine-${COMPONENT_NAME}-badge`,
  clearButton: `mantine-${COMPONENT_NAME}-clearButton`,
};

// CSS Module classes mapped to selectors
export const cssModuleClasses: Record<CompositeFiltersInputStylesNames, string | undefined> = {
  root: undefined, // root uses Box, no specific class
  container: classes.container,
  leftIcon: undefined, // uses ActionIcon
  pillsContainer: classes.pillsContainer,
  input: classes.input,
  rightSection: classes.rightSection,
  dropdown: classes.dropdown,
  badge: undefined, // uses Badge component
  clearButton: undefined, // uses ActionIcon
};

// Export merged classes for Component.classes pattern
export const CompositeFiltersInputClasses: Record<CompositeFiltersInputStylesNames, string> = {
  root: staticClasses.root,
  container: `${staticClasses.container} ${classes.container}`,
  leftIcon: staticClasses.leftIcon,
  pillsContainer: `${staticClasses.pillsContainer} ${classes.pillsContainer}`,
  input: `${staticClasses.input} ${classes.input}`,
  rightSection: `${staticClasses.rightSection} ${classes.rightSection}`,
  dropdown: `${staticClasses.dropdown} ${classes.dropdown}`,
  badge: staticClasses.badge,
  clearButton: staticClasses.clearButton,
};

