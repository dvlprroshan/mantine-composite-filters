import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, Text, Card, SimpleGrid, Badge, useMantineTheme } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search...',
    operators: ['contains', '='],
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'design', label: 'Design' },
      { value: 'business', label: 'Business' },
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
  const theme = useMantineTheme();

  return (
    <Stack gap="xl" p="xl" maw={900}>
      {/* Style 1: Modern Gradient Border */}
      <Card withBorder p="md" radius="md">
        <Badge mb="sm" variant="light" color="indigo">Modern Gradient</Badge>
        <MultiFiltersInput
          filters={sampleFilters}
          value={filters1}
          onChange={setFilters1}
          placeholder="✨ Search with style..."
          styles={{
            container: {
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box',
              border: '2px solid transparent',
              borderRadius: '12px',
            },
            input: {
              fontSize: '15px',
            },
          }}
        />
      </Card>

      {/* Style 2: Dark Mode Look */}
      <Card withBorder p="md" radius="md" bg="dark.7">
        <Badge mb="sm" variant="light" color="cyan">Dark Theme</Badge>
        <MultiFiltersInput
          filters={sampleFilters}
          value={filters2}
          onChange={setFilters2}
          placeholder="🌙 Dark mode search..."
          styles={{
            container: {
              backgroundColor: '#1a1b1e',
              border: '1px solid #373A40',
              borderRadius: '8px',
            },
            input: {
              color: '#C1C2C5',
              backgroundColor: 'transparent',
            },
          }}
        />
      </Card>

      {/* Style 3: Minimal Outlined */}
      <Card withBorder p="md" radius="md">
        <Badge mb="sm" variant="light" color="teal">Minimal Outline</Badge>
        <MultiFiltersInput
          filters={sampleFilters}
          value={filters3}
          onChange={setFilters3}
          placeholder="○ Minimal and clean..."
          styles={{
            container: {
              border: '1px dashed #dee2e6',
              borderRadius: '24px',
              backgroundColor: '#fafafa',
            },
            input: {
              fontSize: '14px',
              fontWeight: 400,
            },
            pillsContainer: {
              gap: '6px',
            },
          }}
        />
      </Card>

      <Text size="xs" c="dimmed" ta="center">
        Use the <code>styles</code> prop to customize container, input, pills, and more
      </Text>
    </Stack>
  );
}

