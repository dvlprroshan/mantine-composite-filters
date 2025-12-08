import React, { useState } from 'react';
import { MultiFiltersInput } from './MultiFiltersInput';
import type { ActiveFilter, FilterDefinition } from '../../types/filter.types';

export default {
  title: 'MultiFiltersInput',
  component: MultiFiltersInput,
};

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
      <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <strong>Active Filters:</strong>
        <pre style={{ marginTop: 8, fontSize: 12 }}>
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function WithMaxFilters() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        maxFilters={3}
        placeholder="Filter by... (max 3 filters)"
      />
    </div>
  );
}

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
        placeholder="Filter by... (with presets)"
      />
    </div>
  );
}

export function OverflowWrap() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        overflowMode="wrap"
        placeholder="Filter by... (wrapping mode)"
      />
    </div>
  );
}

export function CompactMode() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Filter by... (compact mode available in menu)"
      />
    </div>
  );
}

export function AllFilterTypes() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const allTypesFilters: FilterDefinition[] = [
    {
      key: 'text_field',
      label: 'Text Field',
      type: 'text',
      operators: ['contains', 'starts_with', 'ends_with', '='],
    },
    {
      key: 'email_field',
      label: 'Email Field',
      type: 'email',
    },
    {
      key: 'number_field',
      label: 'Number Field',
      type: 'number',
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

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={allTypesFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Try all filter types..."
      />
      <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <strong>Active Filters ({filters.length}):</strong>
        <pre style={{ marginTop: 8, fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export function DisabledFeatures() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        disablePresets
        disableHistory
        placeholder="Filter by... (presets and history disabled)"
      />
    </div>
  );
}

