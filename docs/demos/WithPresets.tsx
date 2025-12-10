import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Card, Text, Stack, Group, ThemeIcon, List, Badge } from '@mantine/core';
import { IconBookmark, IconHistory, IconStar, IconDotsVertical } from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const reportFilters: FilterDefinition[] = [
  {
    key: 'report_name',
    label: 'Report Name',
    type: 'text',
    placeholder: 'Search reports...',
    operators: ['contains', 'starts_with'],
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'sales', label: '💼 Sales' },
      { value: 'marketing', label: '📢 Marketing' },
      { value: 'engineering', label: '💻 Engineering' },
      { value: 'finance', label: '💰 Finance' },
      { value: 'hr', label: '👥 HR' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: '📝 Draft' },
      { value: 'review', label: '👀 In Review' },
      { value: 'approved', label: '✅ Approved' },
      { value: 'published', label: '🚀 Published' },
    ],
  },
  {
    key: 'author',
    label: 'Author',
    type: 'multi_select',
    options: [
      { value: 'me', label: 'My Reports' },
      { value: 'team', label: 'Team Reports' },
      { value: 'shared', label: 'Shared with Me' },
    ],
  },
  {
    key: 'date_range',
    label: 'Date Range',
    type: 'date_range',
  },
];

export function WithPresets() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="lg" p="xl" maw={900}>
      <Card withBorder p="md" radius="md">
        <MultiFiltersInput
          filters={reportFilters}
          value={filters}
          onChange={setFilters}
          disablePresets={false}
          disableHistory={false}
          placeholder="🔍 Filter reports... (try the ⋮ menu for presets)"
          storageKeyPrefix="reports-demo"
        />
      </Card>

      <Card withBorder p="md" radius="md" bg="blue.0">
        <Group gap="xs" mb="sm">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconBookmark size={14} />
          </ThemeIcon>
          <Text fw={600} size="sm">Presets & History Features</Text>
        </Group>
        
        <List size="sm" spacing="xs">
          <List.Item icon={
            <ThemeIcon size="xs" variant="light" color="orange" radius="xl">
              <IconDotsVertical size={10} />
            </ThemeIcon>
          }>
            Click the <Badge size="xs" variant="light">⋮</Badge> menu button to access all features
          </List.Item>
          <List.Item icon={
            <ThemeIcon size="xs" variant="light" color="green" radius="xl">
              <IconBookmark size={10} />
            </ThemeIcon>
          }>
            <strong>Save Preset:</strong> Save your current filter combination for quick access later
          </List.Item>
          <List.Item icon={
            <ThemeIcon size="xs" variant="light" color="yellow" radius="xl">
              <IconStar size={10} />
            </ThemeIcon>
          }>
            <strong>Favorites:</strong> Mark frequently used presets as favorites for easy access
          </List.Item>
          <List.Item icon={
            <ThemeIcon size="xs" variant="light" color="grape" radius="xl">
              <IconHistory size={10} />
            </ThemeIcon>
          }>
            <strong>History:</strong> Your recent filter combinations are automatically tracked
          </List.Item>
        </List>
        
        <Text size="xs" c="dimmed" mt="sm">
          💡 All presets and history are saved to your browser's local storage
        </Text>
      </Card>
    </Stack>
  );
}

