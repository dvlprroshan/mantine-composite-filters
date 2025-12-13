export const CompositeFiltersInputStylesApi = {
  selectors: {
    root: 'Root element (Box wrapper)',
    container: 'Main container with border and background',
    leftIcon: 'Left search icon wrapper (ActionIcon)',
    pillsContainer: 'Container for filter pills and input',
    input: 'Text input element for typing filter values',
    rightSection: 'Right section containing badge, clear button and menu',
    dropdown: 'Dropdown popover content for selections',
    badge: 'Filter count badge showing number of active filters',
    clearButton: 'Clear all filters button (ActionIcon)',
  },

  vars: {
    container: {
      '--composite-filters-border-radius': 'Border radius of the main container',
      '--composite-filters-border-color': 'Border color of the main container',
      '--composite-filters-bg': 'Background color of the main container',
    },
    input: {
      '--composite-filters-input-font-size': 'Font size of the input element',
      '--composite-filters-placeholder-color': 'Color of placeholder text',
    },
    dropdown: {
      '--composite-filters-dropdown-bg': 'Background color of dropdown',
      '--composite-filters-dropdown-border-color': 'Border color of dropdown',
      '--composite-filters-dropdown-shadow': 'Box shadow of dropdown',
    },
  },

  modifiers: [
    {
      modifier: 'data-overflow',
      selector: 'pillsContainer',
      value: '"scroll" | "wrap"',
      condition: 'Based on overflowMode prop',
    },
    {
      modifier: 'data-disabled',
      selector: 'input',
      condition: 'When maxFilters is reached',
    },
    {
      modifier: 'data-focused',
      selector: 'container',
      condition: 'When input is focused',
    },
  ],
};
