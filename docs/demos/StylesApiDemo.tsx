import React, { useState } from 'react';
import { type ActiveFilter, type FilterDefinition, CompositeFiltersInput } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
    ],
  },
];

export function StylesApiDemo(props: any) {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={sampleFilters}
      value={filters}
      onChange={setFilters}
      placeholder="Filter items..."
      {...props}
    />
  );
}
