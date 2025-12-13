import React, { useState } from 'react';
import { Stack, Badge, Group } from '@mantine/core';
import { type ActiveFilter, type FilterDefinition, CompositeFiltersInput } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search...',
    operators: ['contains', '='],
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
      { value: 'featured', label: 'Featured' },
      { value: 'popular', label: 'Popular' },
      { value: 'new', label: 'New' },
    ],
  },
];

export function CustomStyling() {
  const [filters1, setFilters1] = useState<ActiveFilter[]>([]);
  const [filters2, setFilters2] = useState<ActiveFilter[]>([]);
  const [filters3, setFilters3] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="lg" p="md">
      {/* Style 1: Rounded with accent border */}
      <div>
        <Group mb="xs" gap="xs">
          <Badge variant="light" color="blue" size="sm">Accent Border</Badge>
        </Group>
        <CompositeFiltersInput
          filters={sampleFilters}
          value={filters1}
          onChange={setFilters1}
          placeholder="Filter items..."
          styles={{
            container: {
              border: '2px solid var(--mantine-color-blue-5)',
              borderRadius: '12px',
              backgroundColor: 'var(--mantine-color-blue-0)',
            },
          }}
        />
      </div>

      {/* Style 2: Subtle/Minimal */}
      <div>
        <Group mb="xs" gap="xs">
          <Badge variant="light" color="gray" size="sm">Minimal Style</Badge>
        </Group>
        <CompositeFiltersInput
          filters={sampleFilters}
          value={filters2}
          onChange={setFilters2}
          placeholder="Search..."
          styles={{
            container: {
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: '4px',
              backgroundColor: 'var(--mantine-color-gray-0)',
            },
            input: {
              fontSize: '13px',
            },
          }}
        />
      </div>

      {/* Style 3: Pill style with rounded corners */}
      <div>
        <Group mb="xs" gap="xs">
          <Badge variant="light" color="grape" size="sm">Pill Style</Badge>
        </Group>
        <CompositeFiltersInput
          filters={sampleFilters}
          value={filters3}
          onChange={setFilters3}
          placeholder="Add filter..."
          styles={{
            container: {
              borderRadius: '50px',
              paddingLeft: '16px',
              paddingRight: '16px',
            },
          }}
        />
      </div>
    </Stack>
  );
}

