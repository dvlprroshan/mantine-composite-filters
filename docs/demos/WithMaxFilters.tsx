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

export function WithMaxFilters() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const maxFilters = 3;

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        maxFilters={maxFilters}
        placeholder={`Filter by... (max ${maxFilters} filters)`}
      />
      <Alert color="blue" mt="md">
        <Text size="sm">
          Maximum {maxFilters} filters allowed. Once you reach the limit, the input will be disabled.
        </Text>
      </Alert>
    </div>
  );
}

