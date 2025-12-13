export const STYLES_API_DATA: Record<string, any> = {
  CompositeFiltersInput: {
    selectors: {
      root: 'Root element (Box wrapper)',
      container: 'Main container with border and background',
      leftIcon: 'Left search icon wrapper (ActionIcon)',
      pillsContainer: 'Container for filter pills',
      input: 'Text input element for typing filter values',
      rightSection: 'Right section containing badge, clear button and menu',
      dropdown: 'Dropdown popover content for selections',
      badge: 'Filter count badge showing number of active filters',
      clearButton: 'Clear all filters button (ActionIcon)',
    },
    vars: {},
    modifiers: [
      {
        modifier: 'data-overflow',
        selector: 'pillsContainer',
        value: '"scroll" | "wrap"',
        condition: 'Based on overflowMode prop',
      },
    ],
  },
};
