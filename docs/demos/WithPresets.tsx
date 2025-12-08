import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Alert, Text } from '@mantine/core';
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
      { value: 'pending', label: 'Pending' },
    ],
  },
];

export function WithPresets() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        disablePresets={false}
        disableHistory={false}
        placeholder="Filter by... (with presets & history)"
      />
      <Alert color="blue" mt="md">
        <Text size="sm">
          Use the menu button (⋮) to access presets and filter history. You can save your current filter
          configuration as a preset and load it later. Filter history automatically tracks your recent filter
          combinations.
        </Text>
      </Alert>
    </div>
  );
}

