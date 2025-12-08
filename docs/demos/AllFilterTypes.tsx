import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const allTypesFilters: FilterDefinition[] = [
  {
    key: 'text_field',
    label: 'Text Field',
    type: 'text',
    placeholder: 'Enter text...',
    operators: ['contains', 'starts_with', 'ends_with', '='],
  },
  {
    key: 'email_field',
    label: 'Email Field',
    type: 'email',
    placeholder: 'Enter email...',
  },
  {
    key: 'number_field',
    label: 'Number Field',
    type: 'number',
    placeholder: 'Enter number...',
    operators: ['=', '!=', '>', '<', '>=', '<='],
  },
  {
    key: 'single_select',
    label: 'Single Select',
    type: 'select',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' },
      { value: 'opt4', label: 'Option 4' },
    ],
  },
  {
    key: 'multi_select',
    label: 'Multi Select',
    type: 'multi_select',
    options: [
      { value: 'tag1', label: 'Tag 1' },
      { value: 'tag2', label: 'Tag 2' },
      { value: 'tag3', label: 'Tag 3' },
      { value: 'tag4', label: 'Tag 4' },
    ],
  },
  {
    key: 'date_field',
    label: 'Date',
    type: 'date',
  },
  {
    key: 'date_range_field',
    label: 'Date Range',
    type: 'date_range',
  },
];

export function AllFilterTypes() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={allTypesFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Try all filter types..."
      />
      {filters.length > 0 && (
        <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <strong>Active Filters ({filters.length}):</strong>
          <pre style={{ marginTop: 8, fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(filters, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

