import React, { useState } from 'react';
import { type ActiveFilter, type FilterDefinition, MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, TextInput, NumberInput, Switch, Select, Paper, Group, Box, Text, Divider } from '@mantine/core';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', operators: ['contains', 'starts_with', '='] },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]},
  { key: 'tags', label: 'Tags', type: 'multi_select', options: [
    { value: 'featured', label: 'Featured' },
    { value: 'new', label: 'New' },
  ]},
  { key: 'date', label: 'Date', type: 'date_range' },
];

export function Configurator() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [placeholder, setPlaceholder] = useState('Filter...');
  const [maxFilters, setMaxFilters] = useState<number | undefined>(undefined);
  const [disablePresets, setDisablePresets] = useState(false);
  const [disableHistory, setDisableHistory] = useState(false);
  const [overflowMode, setOverflowMode] = useState<'scroll' | 'wrap'>('scroll');

  return (
    <Group align="flex-start" gap="md" p="md" wrap="nowrap">
      {/* Filter Component */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <MultiFiltersInput
          filters={filters}
          value={activeFilters}
          onChange={setActiveFilters}
          placeholder={placeholder}
          maxFilters={maxFilters}
          disablePresets={disablePresets}
          disableHistory={disableHistory}
          overflowMode={overflowMode}
        />
      </Box>

      {/* Config Panel */}
      <Paper p="sm" withBorder radius="md" style={{ width: 240, flexShrink: 0 }}>
        <Text size="sm" fw={500} mb="sm">Options</Text>
        
        <Stack gap="xs">
          <TextInput
            label="Placeholder"
            size="xs"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.currentTarget.value)}
          />
          
          <NumberInput
            label="Max Filters"
            size="xs"
            value={maxFilters}
            onChange={(v) => setMaxFilters(v === '' ? undefined : Number(v))}
            min={1}
            placeholder="Unlimited"
          />
          
          <Select
            label="Overflow"
            size="xs"
            value={overflowMode}
            onChange={(v) => setOverflowMode(v as 'scroll' | 'wrap')}
            data={[
              { value: 'scroll', label: 'Scroll' },
              { value: 'wrap', label: 'Wrap' },
            ]}
          />
          
          <Divider my="xs" />
          
          <Switch
            label="Disable Presets"
            size="xs"
            checked={disablePresets}
            onChange={(e) => setDisablePresets(e.currentTarget.checked)}
          />
          
          <Switch
            label="Disable History"
            size="xs"
            checked={disableHistory}
            onChange={(e) => setDisableHistory(e.currentTarget.checked)}
          />
        </Stack>
      </Paper>
    </Group>
  );
}
