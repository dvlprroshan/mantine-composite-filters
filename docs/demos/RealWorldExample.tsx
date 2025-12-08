import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Card, Title, Text, Stack, Table } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const userFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'User Name',
    type: 'text',
    placeholder: 'Search by name...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email...',
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'moderator', label: 'Moderator' },
      { value: 'guest', label: 'Guest' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'premium', label: 'Premium' },
      { value: 'verified', label: 'Verified' },
      { value: 'beta', label: 'Beta Tester' },
    ],
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'date',
  },
  {
    key: 'last_login',
    label: 'Last Login Range',
    type: 'date_range',
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'Enter age...',
    operators: ['=', '>', '<', '>=', '<='],
  },
];

export function RealWorldExample() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  // Simulate filtered data
  const filteredCount = Math.floor(Math.random() * 1000) + filters.length * 10;

  return (
    <div style={{ padding: 40, maxWidth: 1000 }}>
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">User Management Dashboard</Title>
          <Text c="dimmed">
            Use the filter below to search and filter users. All filters are saved to your browser's local storage.
          </Text>
        </div>

        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={userFilters}
            value={filters}
            onChange={setFilters}
            placeholder="Filter users..."
            storageKeyPrefix="user-filters"
          />
        </Card>

        <Card withBorder p="md" radius="md">
          <Stack gap="md">
            <div>
              <Text fw={500} size="lg" mb="xs">
                Filter Results
              </Text>
              <Text c="dimmed" size="sm">
                {filters.length > 0
                  ? `Showing ${filteredCount} users matching your filters`
                  : 'No filters applied. Showing all users.'}
              </Text>
            </div>

            {filters.length > 0 && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Filter</Table.Th>
                    <Table.Th>Operator</Table.Th>
                    <Table.Th>Value</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filters.map((filter) => (
                    <Table.Tr key={filter.id}>
                      <Table.Td>{filter.label}</Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {filter.operator}
                        </Text>
                      </Table.Td>
                      <Table.Td>{filter.displayValue}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

            {filters.length === 0 && (
              <Text c="dimmed" size="sm" ta="center" py="xl">
                Apply filters to see results
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}

