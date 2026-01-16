import React, { useState, useMemo } from 'react';
import { Stack, Text, Card, Code, Tabs } from '@mantine/core';
import { 
  type ActiveFilter, 
  type FilterDefinition, 
  type StorageAdapter,
  type SavedFilterPreset,
  type FilterHistory,
  CompositeFiltersInput,
  createLocalStorageAdapter,
} from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
  { key: 'date', label: 'Date', type: 'date' },
];

const createInMemoryAdapter = <T,>(defaultValue: T): StorageAdapter<T> => {
  let data: T = defaultValue;
  return {
    get: () => data,
    set: (value: T) => { data = value; },
    remove: () => { data = defaultValue; },
  };
};

export function CustomStorageAdapter() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('memory');

  const memoryPresetsAdapter = useMemo(() => 
    createInMemoryAdapter<SavedFilterPreset[]>([]), []
  );
  const memoryHistoryAdapter = useMemo(() => 
    createInMemoryAdapter<FilterHistory[]>([]), []
  );

  const localPresetsAdapter = useMemo(() => 
    createLocalStorageAdapter<SavedFilterPreset[]>('custom-demo-presets', []), []
  );
  const localHistoryAdapter = useMemo(() => 
    createLocalStorageAdapter<FilterHistory[]>('custom-demo-history', []), []
  );

  return (
    <Stack gap="md" p="md">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="memory">In-Memory Storage</Tabs.Tab>
          <Tabs.Tab value="local">Custom localStorage</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="memory" pt="md">
          <CompositeFiltersInput
            filters={filters}
            value={activeFilters}
            onChange={setActiveFilters}
            presetsStorageAdapter={memoryPresetsAdapter}
            historyStorageAdapter={memoryHistoryAdapter}
            placeholder="Presets stored in memory only..."
          />
          <Text size="xs" c="dimmed" mt="xs">
            Data is lost on page refresh
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="local" pt="md">
          <CompositeFiltersInput
            filters={filters}
            value={activeFilters}
            onChange={setActiveFilters}
            presetsStorageAdapter={localPresetsAdapter}
            historyStorageAdapter={localHistoryAdapter}
            placeholder="Using custom localStorage adapter..."
          />
          <Text size="xs" c="dimmed" mt="xs">
            Data persists across sessions
          </Text>
        </Tabs.Panel>
      </Tabs>

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">Storage Adapter Interface:</Text>
        <Code block>
{`interface StorageAdapter<T> {
  get: () => T | Promise<T>;
  set: (value: T) => void | Promise<void>;
  remove: () => void | Promise<void>;
}`}
        </Code>
      </Card>
    </Stack>
  );
}
