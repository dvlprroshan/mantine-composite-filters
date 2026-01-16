import type { MantineDemo } from '@mantinex/demo';
import { Configurator } from './Configurator';
import { Usage } from './Usage';
import { AllFilterTypes } from './AllFilterTypes';
import { WithMaxFilters } from './WithMaxFilters';
import { OverflowModes } from './OverflowModes';
import { WithPresets } from './WithPresets';
import { CustomStorageAdapter } from './CustomStorageAdapter';
import { CustomStyling } from './CustomStyling';
import { CustomPills } from './CustomPills';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { SimpleDataTableDemo } from './SimpleDataTableDemo';
import { StylesApiDemo } from './StylesApiDemo';
import { CompositeFiltersInputStylesApi } from '../styles-api/CompositeFiltersInput.styles-api';

const usageCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

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
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      placeholder="Filter by..."
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: usageCode,
};

const configuratorCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      placeholder="Filter..."
      maxFilters={undefined}
      overflowMode="scroll"
      disablePresets={false}
      disableHistory={false}
    />
  );
}
`;

export const configurator: MantineDemo = {
  type: 'code',
  component: Configurator,
  code: configuratorCode,
};

const allFilterTypesCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

// All 7 filter types
const allFilters: FilterDefinition[] = [
  {
    key: 'text_field',
    label: 'Text',
    type: 'text',
    placeholder: 'Enter text...',
    operators: ['contains', 'starts_with', 'ends_with', '='],
  },
  {
    key: 'email_field',
    label: 'Email',
    type: 'email',
    placeholder: 'user@email.com',
  },
  {
    key: 'number_field',
    label: 'Number',
    type: 'number',
    placeholder: 'Enter number...',
    operators: ['=', '!=', '>', '<', '>=', '<='],
  },
  {
    key: 'select_field',
    label: 'Select',
    type: 'select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
  {
    key: 'multi_select_field',
    label: 'Multi Select',
    type: 'multi_select',
    options: [
      { value: 'tag1', label: 'Tag 1' },
      { value: 'tag2', label: 'Tag 2' },
    ],
  },
  {
    key: 'date_field',
    label: 'Date',
    type: 'date',
  },
  {
    key: 'date_range_field',
    label: 'Date Range',
    type: 'date_range',
  },
];

function Demo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={allFilters}
      value={filters}
      onChange={setFilters}
      placeholder="Try each filter type..."
    />
  );
}
`;

export const allFilterTypes: MantineDemo = {
  type: 'code',
  component: AllFilterTypes,
  code: allFilterTypesCode,
};

const withMaxFiltersCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      maxFilters={3}
      placeholder="Filter by... (max 3 filters)"
    />
  );
}
`;

export const withMaxFilters: MantineDemo = {
  type: 'code',
  component: WithMaxFilters,
  code: withMaxFiltersCode,
};

const overflowModesCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
];

function Demo() {
  const [filters1, setFilters1] = useState<ActiveFilter[]>([]);
  const [filters2, setFilters2] = useState<ActiveFilter[]>([]);

  return (
    <>
      {/* Scroll Mode - filters scroll horizontally */}
      <CompositeFiltersInput
        filters={filters}
        value={filters1}
        onChange={setFilters1}
        overflowMode="scroll"
        placeholder="Scroll mode"
      />

      {/* Wrap Mode - filters wrap to new lines */}
      <CompositeFiltersInput
        filters={filters}
        value={filters2}
        onChange={setFilters2}
        overflowMode="wrap"
        placeholder="Wrap mode"
      />
    </>
  );
}
`;

export const overflowModes: MantineDemo = {
  type: 'code',
  component: OverflowModes,
  code: overflowModesCode,
};

const withPresetsCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
  { key: 'date', label: 'Date', type: 'date_range' },
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      disablePresets={false}
      disableHistory={false}
      storageKeyPrefix="my-app"
      placeholder="Filter... (try the menu)"
    />
  );
}
`;

export const withPresets: MantineDemo = {
  type: 'code',
  component: WithPresets,
  code: withPresetsCode,
};

const customStorageAdapterCode = `
import { useState, useMemo } from 'react';
import { 
  CompositeFiltersInput,
  createLocalStorageAdapter,
  type ActiveFilter,
  type FilterDefinition,
  type StorageAdapter,
  type SavedFilterPreset,
  type FilterHistory,
} from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
];

// Example: In-memory adapter (no persistence)
const createInMemoryAdapter = <T,>(defaultValue: T): StorageAdapter<T> => {
  let data: T = defaultValue;
  return {
    get: () => data,
    set: (value: T) => { data = value; },
    remove: () => { data = defaultValue; },
  };
};

// Example: API-based adapter (async)
const createApiAdapter = <T,>(endpoint: string): StorageAdapter<T> => ({
  get: async () => {
    const response = await fetch(endpoint);
    return response.json();
  },
  set: async (value: T) => {
    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(value),
    });
  },
  remove: async () => {
    await fetch(endpoint, { method: 'DELETE' });
  },
});

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const presetsAdapter = useMemo(() => 
    createInMemoryAdapter<SavedFilterPreset[]>([]), []
  );
  const historyAdapter = useMemo(() => 
    createInMemoryAdapter<FilterHistory[]>([]), []
  );

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      presetsStorageAdapter={presetsAdapter}
      historyStorageAdapter={historyAdapter}
      placeholder="Using custom storage..."
    />
  );
}
`;

export const customStorageAdapter: MantineDemo = {
  type: 'code',
  component: CustomStorageAdapter,
  code: customStorageAdapterCode,
};

const customStylingCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'search', label: 'Search', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      placeholder="Filter items..."
      styles={{
        container: {
          border: '2px solid var(--mantine-color-blue-5)',
          borderRadius: '12px',
        },
      }}
    />
  );
}
`;

export const customStyling: MantineDemo = {
  type: 'code',
  component: CustomStyling,
  code: customStylingCode,
};

const customPillsCode = `
import { useState } from 'react';
import { Badge, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ]},
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      placeholder="Add filters..."
      renderPill={(filter, onRemove) => (
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: 'violet', to: 'grape' }}
          rightSection={
            <ActionIcon size={16} radius="xl" variant="transparent" onClick={onRemove}>
              <IconX size={10} color="white" />
            </ActionIcon>
          }
        >
          {filter.label}: {filter.displayValue}
        </Badge>
      )}
    />
  );
}
`;

export const customPills: MantineDemo = {
  type: 'code',
  component: CustomPills,
  code: customPillsCode,
};

const keyboardShortcutsCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  return (
    <CompositeFiltersInput
      filters={filters}
      value={activeFilters}
      onChange={setActiveFilters}
      placeholder="Try keyboard shortcuts..."
    />
  );
}

// Shortcuts:
// ⌘/Ctrl + / - Focus input
// ⌘/Ctrl + ⌫ - Clear all
// Enter - Submit value
// Escape - Cancel
// Backspace - Remove last filter
`;

export const keyboardShortcuts: MantineDemo = {
  type: 'code',
  component: KeyboardShortcuts,
  code: keyboardShortcutsCode,
};

const simpleDataTableCode = `
import { useState, useMemo } from 'react';
import { Table } from '@mantine/core';
import { CompositeFiltersInput } from 'mantine-composite-filters';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', operators: ['contains', '='] },
  { key: 'role', label: 'Role', type: 'select', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ]},
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
];

const users = [
  { id: 1, name: 'Alice Chen', role: 'admin', status: 'active' },
  { id: 2, name: 'Bob Smith', role: 'user', status: 'active' },
  { id: 3, name: 'Carol Davis', role: 'user', status: 'inactive' },
];

function Demo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      activeFilters.every(filter => {
        const value = user[filter.key];
        if (filter.operator === 'contains') {
          return value.toLowerCase().includes(filter.value.toLowerCase());
        }
        return value.toLowerCase() === filter.value.toLowerCase();
      })
    );
  }, [activeFilters]);

  return (
    <>
      <CompositeFiltersInput
        filters={filters}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Filter users..."
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredUsers.map(user => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.role}</Table.Td>
              <Table.Td>{user.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
`;

export const simpleDataTable: MantineDemo = {
  type: 'code',
  component: SimpleDataTableDemo,
  code: simpleDataTableCode,
};

const stylesApiCode = `
import { useState } from 'react';
import { CompositeFiltersInput } from 'mantine-composite-filters';

function Demo() {
  const [filters, setFilters] = useState([]);

  return (
    <CompositeFiltersInput{{props}}
      filters={sampleFilters}
      value={filters}
      onChange={setFilters}
      placeholder="Filter items..."
    />
  );
}
`;

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: CompositeFiltersInputStylesApi,
  component: StylesApiDemo,
  code: stylesApiCode,
  centered: true,
  maxWidth: 500,
};
