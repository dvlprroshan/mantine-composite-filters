import React, { useState, useMemo } from 'react';
import { Card, Table, Badge, Group, Text, Avatar, Stack } from '@mantine/core';
import { type ActiveFilter, type FilterDefinition, CompositeFiltersInput } from 'mantine-composite-filters';

// Simple filter definitions
const filters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Search name...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'user@example.com',
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'department',
    label: 'Department',
    type: 'multi_select',
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
    ],
  },
  {
    key: 'joined',
    label: 'Joined Date',
    type: 'date_range',
  },
];

// Sample data
const users = [
  { id: 1, name: 'Alice Chen', email: 'alice@company.com', role: 'admin', status: 'active', department: 'Engineering' },
  { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'editor', status: 'active', department: 'Design' },
  { id: 3, name: 'Carol Davis', email: 'carol@company.com', role: 'viewer', status: 'inactive', department: 'Marketing' },
  { id: 4, name: 'Dan Wilson', email: 'dan@company.com', role: 'editor', status: 'active', department: 'Sales' },
  { id: 5, name: 'Eva Martinez', email: 'eva@company.com', role: 'viewer', status: 'active', department: 'Engineering' },
];

export function SimpleDataTableDemo() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  // Simple client-side filtering
  const filteredUsers = useMemo(() => {
    if (activeFilters.length === 0) {return users;}
    
    return users.filter(user => {
      return activeFilters.every(filter => {
        const value = user[filter.key as keyof typeof user];
        if (!value) {return true;}
        
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'starts_with':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case '=':
            return String(value).toLowerCase() === String(filter.value).toLowerCase();
          default:
            return true;
        }
      });
    });
  }, [activeFilters]);

  return (
    <Stack gap="md" p="md">
      {/* Filter Input */}
      <CompositeFiltersInput
        filters={filters}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Filter users..."
        storageKeyPrefix="simple-demo"
      />

      {/* Results count */}
      <Text size="sm" c="dimmed">
        Showing {filteredUsers.length} of {users.length} users
      </Text>

      {/* Data Table */}
      <Card withBorder p={0} radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.map(user => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="blue">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500}>{user.name}</Text>
                      <Text size="xs" c="dimmed">{user.email}</Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>{user.department}</Table.Td>
                <Table.Td>
                  <Badge 
                    color={user.status === 'active' ? 'green' : 'gray'} 
                    variant="dot" 
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {filteredUsers.length === 0 && (
        <Text ta="center" c="dimmed" py="xl">
          No users match the current filters
        </Text>
      )}
    </Stack>
  );
}
