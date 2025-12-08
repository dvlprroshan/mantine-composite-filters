import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Alert, Text, Code, Stack } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name...',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email...',
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];

export function KeyboardShortcuts() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <Stack gap="md">
        <MultiFiltersInput
          filters={sampleFilters}
          value={filters}
          onChange={setFilters}
          placeholder="Filter by... (try keyboard shortcuts)"
        />
        <Alert color="blue">
          <Text size="sm" fw={500} mb="xs">
            Available Keyboard Shortcuts:
          </Text>
          <Stack gap={4}>
            <Text size="sm">
              <Code>⌘/Ctrl + /</Code> - Focus the filter input
            </Text>
            <Text size="sm">
              <Code>⌘/Ctrl + ⌫</Code> - Clear all filters
            </Text>
            <Text size="sm">
              <Code>Enter</Code> - Submit filter value
            </Text>
            <Text size="sm">
              <Code>Escape</Code> - Cancel current input
            </Text>
            <Text size="sm">
              <Code>Backspace</Code> - Remove last filter (when input is empty)
            </Text>
          </Stack>
        </Alert>
      </Stack>
    </div>
  );
}

