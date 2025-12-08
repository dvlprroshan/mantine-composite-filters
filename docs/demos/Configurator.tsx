import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, TextInput, NumberInput, Switch, Select, Paper, Group, Box } from '@mantine/core';
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
];

export function Configurator() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [placeholder, setPlaceholder] = useState('Filter by...');
  const [maxFilters, setMaxFilters] = useState<number | undefined>(undefined);
  const [disablePresets, setDisablePresets] = useState(false);
  const [disableHistory, setDisableHistory] = useState(false);
  const [overflowMode, setOverflowMode] = useState<'scroll' | 'wrap'>('scroll');

  return (
    <Group align="flex-start" gap="xl" wrap="nowrap" style={{ padding: 20 }}>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <MultiFiltersInput
          filters={sampleFilters}
          value={filters}
          onChange={setFilters}
          placeholder={placeholder}
          maxFilters={maxFilters}
          disablePresets={disablePresets}
          disableHistory={disableHistory}
          overflowMode={overflowMode}
        />
      </Box>
      <Paper p="md" withBorder style={{ width: 280, flexShrink: 0 }}>
        <Stack gap="md">
          <TextInput
            label="Placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.currentTarget.value)}
          />
          <NumberInput
            label="Max Filters"
            description="Leave empty for unlimited"
            value={maxFilters}
            onChange={(value) => setMaxFilters(value === '' ? undefined : Number(value))}
            min={1}
            allowNegative={false}
          />
          <Select
            label="Overflow Mode"
            value={overflowMode}
            onChange={(value) => setOverflowMode(value as 'scroll' | 'wrap')}
            data={[
              { value: 'scroll', label: 'Scroll' },
              { value: 'wrap', label: 'Wrap' },
            ]}
          />
          <Switch
            label="Disable Presets"
            checked={disablePresets}
            onChange={(e) => setDisablePresets(e.currentTarget.checked)}
          />
          <Switch
            label="Disable History"
            checked={disableHistory}
            onChange={(e) => setDisableHistory(e.currentTarget.checked)}
          />
        </Stack>
      </Paper>
    </Group>
  );
}
