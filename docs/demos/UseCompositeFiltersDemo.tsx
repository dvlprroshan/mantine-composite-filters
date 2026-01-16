import { useState } from 'react';
import { Stack, Group, Button, Text, Badge, Code, Paper } from '@mantine/core';
import { 
  CompositeFiltersInput, 
  useCompositeFilters,
  type FilterDefinition 
} from 'mantine-composite-filters';

const filterDefinitions: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', operators: ['contains', 'starts_with', '='] },
  { key: 'email', label: 'Email', type: 'email' },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select', 
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'inactive', label: 'Inactive' },
    ] 
  },
  { key: 'age', label: 'Age', type: 'number' },
];

export function UseCompositeFiltersDemo() {
  const {
    activeFilters,
    setActiveFilters,
    addFilterByKey,
    removeFilter,
    clearFilters,
    filtersCount,
    hasAnyFilter,
    toQueryString,
    toApiFormat,
    isDirty,
    presets,
    savePreset,
    history,
  } = useCompositeFilters({
    filterDefinitions,
    enableHistory: true,
    enablePresets: true,
    presetsStorageKey: 'demo-presets',
    historyStorageKey: 'demo-history',
  });

  const [presetName, setPresetName] = useState('');

  return (
    <Stack gap="md">
      <CompositeFiltersInput
        filters={filterDefinitions}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Filter..."
        disablePresets
        disableHistory
      />

      <Group gap="xs">
        <Button 
          size="xs" 
          variant="light"
          onClick={() => addFilterByKey('status', '=', 'active', 'Active')}
        >
          Add Active Status
        </Button>
        <Button 
          size="xs" 
          variant="light"
          onClick={() => addFilterByKey('name', 'contains', 'John', 'John')}
        >
          Add Name Filter
        </Button>
        <Button 
          size="xs" 
          variant="light" 
          color="red"
          onClick={clearFilters}
          disabled={!hasAnyFilter()}
        >
          Clear All
        </Button>
      </Group>

      <Group gap="md">
        <Badge color={isDirty ? 'yellow' : 'green'}>
          {isDirty ? 'Modified' : 'Clean'}
        </Badge>
        <Badge variant="outline">
          {filtersCount} filter{filtersCount !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" color="grape">
          {presets.length} preset{presets.length !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" color="cyan">
          {history.length} history
        </Badge>
      </Group>

      {hasAnyFilter() && (
        <Paper p="xs" withBorder>
          <Text size="xs" c="dimmed" mb={4}>Query String:</Text>
          <Code block style={{ fontSize: 11 }}>
            {toQueryString() || '(empty)'}
          </Code>
          <Text size="xs" c="dimmed" mt="sm" mb={4}>API Format:</Text>
          <Code block style={{ fontSize: 11 }}>
            {JSON.stringify(toApiFormat(), null, 2)}
          </Code>
        </Paper>
      )}
    </Stack>
  );
}
