import React, { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import { Text, Stack, Code, Card, Badge, Group } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

// Define available filters
const filters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Search...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
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
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'new', label: 'New' },
      { value: 'verified', label: 'Verified' },
    ],
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'number',
    operators: ['=', '>', '<', '>=', '<='],
  },
  {
    key: 'date',
    label: 'Date Range',
    type: 'date_range',
  },
];

export function Usage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="md" p="md">
      <CompositeFiltersInput
        filters={filters}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Filter by..."
      />

      {activeFilters.length > 0 && (
        <Card withBorder p="sm" radius="md">
          <Group mb="xs">
            <Text size="sm" fw={500}>Active Filters</Text>
            <Badge size="sm" variant="light">{activeFilters.length}</Badge>
          </Group>
          <Code block style={{ fontSize: 12 }}>
            {JSON.stringify(activeFilters, null, 2)}
          </Code>
        </Card>
      )}
    </Stack>
  );
}

