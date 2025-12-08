import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, Title, Text } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
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
  {
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'important', label: 'Important' },
    ],
  },
];

export function OverflowModes() {
  const [filtersScroll, setFiltersScroll] = useState<ActiveFilter[]>([]);
  const [filtersWrap, setFiltersWrap] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <Stack gap="xl">
        <div>
          <Title order={4} mb="xs">Scroll Mode (default)</Title>
          <Text size="sm" c="dimmed" mb="md">
            Filters scroll horizontally when they exceed the container width
          </Text>
          <div style={{ maxWidth: 400, border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
            <MultiFiltersInput
              filters={sampleFilters}
              value={filtersScroll}
              onChange={setFiltersScroll}
              overflowMode="scroll"
              placeholder="Filter by... (scroll mode)"
            />
          </div>
        </div>

        <div>
          <Title order={4} mb="xs">Wrap Mode</Title>
          <Text size="sm" c="dimmed" mb="md">
            Filters wrap to multiple lines when they exceed the container width
          </Text>
          <div style={{ maxWidth: 400, border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
            <MultiFiltersInput
              filters={sampleFilters}
              value={filtersWrap}
              onChange={setFiltersWrap}
              overflowMode="wrap"
              placeholder="Filter by... (wrap mode)"
            />
          </div>
        </div>
      </Stack>
    </div>
  );
}

