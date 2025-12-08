import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name...',
    operators: ['contains', 'starts_with', 'ends_with', '='],
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
    operators: ['=', '!=', '>', '<', '>=', '<='],
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
  {
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'important', label: 'Important' },
      { value: 'normal', label: 'Normal' },
      { value: 'low', label: 'Low Priority' },
    ],
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'date',
  },
  {
    key: 'date_range',
    label: 'Date Range',
    type: 'date_range',
  },
];

export function Usage() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Filter by..."
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

