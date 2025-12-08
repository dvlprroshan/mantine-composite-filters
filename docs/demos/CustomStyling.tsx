import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
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
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];

export function CustomStyling() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Filter by..."
        styles={{
          container: {
            border: '2px solid #4c6ef5',
            borderRadius: '12px',
            backgroundColor: '#f8f9ff',
          },
          input: {
            fontSize: '16px',
            fontWeight: 500,
          },
          pillsContainer: {
            gap: '8px',
          },
        }}
        classNames={{
          root: 'custom-filter-root',
        }}
      />
    </div>
  );
}

