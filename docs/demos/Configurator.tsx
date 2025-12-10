import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, TextInput, NumberInput, Switch, Select, Paper, Group, Box, Text, Divider, Badge, ThemeIcon } from '@mantine/core';
import { IconSettings, IconAdjustments } from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const projectFilters: FilterDefinition[] = [
  {
    key: 'project_name',
    label: 'Project Name',
    type: 'text',
    placeholder: 'Search projects...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'owner_email',
    label: 'Owner Email',
    type: 'email',
    placeholder: 'owner@company.com',
  },
  {
    key: 'budget',
    label: 'Budget ($)',
    type: 'number',
    placeholder: 'Enter budget...',
    operators: ['=', '>', '<', '>=', '<='],
  },
  {
    key: 'status',
    label: 'Project Status',
    type: 'select',
    options: [
      { value: 'planning', label: '📋 Planning' },
      { value: 'active', label: '🚀 Active' },
      { value: 'on_hold', label: '⏸️ On Hold' },
      { value: 'completed', label: '✅ Completed' },
    ],
  },
  {
    key: 'team_members',
    label: 'Team Members',
    type: 'multi_select',
    options: [
      { value: 'alice', label: 'Alice Chen' },
      { value: 'bob', label: 'Bob Smith' },
      { value: 'carol', label: 'Carol Davis' },
      { value: 'dan', label: 'Dan Wilson' },
    ],
  },
  {
    key: 'deadline',
    label: 'Deadline',
    type: 'date_range',
  },
];

export function Configurator() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [placeholder, setPlaceholder] = useState('Filter projects...');
  const [maxFilters, setMaxFilters] = useState<number | undefined>(undefined);
  const [disablePresets, setDisablePresets] = useState(false);
  const [disableHistory, setDisableHistory] = useState(false);
  const [overflowMode, setOverflowMode] = useState<'scroll' | 'wrap'>('scroll');

  return (
    <Box p="md">
      <Group align="flex-start" gap="xl" wrap="nowrap">
        {/* Main Filter Area */}
        <Stack style={{ flex: 1, minWidth: 0 }} gap="md">
          <MultiFiltersInput
            filters={projectFilters}
            value={filters}
            onChange={setFilters}
            placeholder={placeholder}
            maxFilters={maxFilters}
            disablePresets={disablePresets}
            disableHistory={disableHistory}
            overflowMode={overflowMode}
          />
          
          {filters.length > 0 && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">Active:</Text>
              {filters.map((f) => (
                <Badge key={f.id} variant="light" size="sm">
                  {f.label}: {f.displayValue}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>

        {/* Configuration Panel */}
        <Paper p="md" withBorder radius="md" style={{ width: 300, flexShrink: 0 }}>
          <Group gap="xs" mb="md">
            <ThemeIcon size="sm" variant="light" color="blue">
              <IconAdjustments size={14} />
            </ThemeIcon>
            <Text fw={600} size="sm">Configuration</Text>
          </Group>
          
          <Stack gap="sm">
            <TextInput
              label="Placeholder Text"
              size="xs"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.currentTarget.value)}
            />
            
            <NumberInput
              label="Max Filters"
              description="Limit number of filters"
              size="xs"
              value={maxFilters}
              onChange={(value) => setMaxFilters(value === '' ? undefined : Number(value))}
              min={1}
              max={10}
              allowNegative={false}
              placeholder="Unlimited"
            />
            
            <Select
              label="Overflow Behavior"
              size="xs"
              value={overflowMode}
              onChange={(value) => setOverflowMode(value as 'scroll' | 'wrap')}
              data={[
                { value: 'scroll', label: '↔️ Horizontal Scroll' },
                { value: 'wrap', label: '↩️ Wrap to New Line' },
              ]}
            />
            
            <Divider my="xs" />
            
            <Switch
              label="Disable Presets"
              description="Hide save/load presets"
              size="xs"
              checked={disablePresets}
              onChange={(e) => setDisablePresets(e.currentTarget.checked)}
            />
            
            <Switch
              label="Disable History"
              description="Don't track filter history"
              size="xs"
              checked={disableHistory}
              onChange={(e) => setDisableHistory(e.currentTarget.checked)}
            />
          </Stack>
        </Paper>
      </Group>
    </Box>
  );
}
