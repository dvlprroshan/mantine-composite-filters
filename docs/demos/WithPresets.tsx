import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, Text, Card, List } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]},
  { key: 'date', label: 'Date', type: 'date_range' },
];

export function WithPresets() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="md" p="md">
      <MultiFiltersInput
        filters={filters}
        value={activeFilters}
        onChange={setActiveFilters}
        disablePresets={false}
        disableHistory={false}
        placeholder="Filter... (try the menu)"
        storageKeyPrefix="presets-demo"
      />

      <Card withBorder p="sm" radius="md" bg="gray.0">
        <Text size="sm" fw={500} mb="xs">Click the ⋮ menu to:</Text>
        <List size="sm" spacing={4}>
          <List.Item>Save current filters as a preset</List.Item>
          <List.Item>Load saved presets</List.Item>
          <List.Item>Mark presets as favorites</List.Item>
          <List.Item>View filter history</List.Item>
        </List>
        <Text size="xs" c="dimmed" mt="xs">
          Data persists in browser localStorage
        </Text>
      </Card>
    </Stack>
  );
}

