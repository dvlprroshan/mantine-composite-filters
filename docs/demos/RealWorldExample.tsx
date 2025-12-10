import React, { useState, useMemo } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Card, Title, Text, Stack, Table, Badge, Avatar, Group, ThemeIcon, Box } from '@mantine/core';
import { IconUsers, IconShieldCheck, IconUser, IconUserCog, IconUserQuestion } from '@tabler/icons-react';
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
      { value: 'admin', label: '👑 Admin' },
      { value: 'moderator', label: '🛡️ Moderator' },
      { value: 'user', label: '👤 User' },
      { value: 'guest', label: '👻 Guest' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: '🟢 Active' },
      { value: 'inactive', label: '⚪ Inactive' },
      { value: 'suspended', label: '🔴 Suspended' },
    ],
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'vip', label: '⭐ VIP' },
      { value: 'premium', label: '💎 Premium' },
      { value: 'verified', label: '✓ Verified' },
      { value: 'beta', label: '🧪 Beta Tester' },
    ],
  },
  {
    key: 'created_at',
    label: 'Joined Date',
    type: 'date_range',
  },
  {
    key: 'login_count',
    label: 'Login Count',
    type: 'number',
    placeholder: 'Number of logins...',
    operators: ['=', '>', '<', '>=', '<='],
  },
];

// Mock users data
const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'admin', status: 'active', tags: ['vip', 'verified'], joined: 'Jan 2023' },
  { id: 2, name: 'Bob Williams', email: 'bob@company.com', role: 'moderator', status: 'active', tags: ['premium'], joined: 'Mar 2023' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'user', status: 'active', tags: ['verified', 'beta'], joined: 'Jun 2023' },
  { id: 4, name: 'Dan Miller', email: 'dan@example.com', role: 'user', status: 'inactive', tags: [], joined: 'Aug 2023' },
  { id: 5, name: 'Eva Martinez', email: 'eva@company.com', role: 'guest', status: 'suspended', tags: [], joined: 'Oct 2023' },
];

const roleIcons: Record<string, React.ReactNode> = {
  admin: <IconShieldCheck size={14} />,
  moderator: <IconUserCog size={14} />,
  user: <IconUser size={14} />,
  guest: <IconUserQuestion size={14} />,
};

const roleColors: Record<string, string> = {
  admin: 'red',
  moderator: 'orange',
  user: 'blue',
  guest: 'gray',
};

const statusColors: Record<string, string> = {
  active: 'green',
  inactive: 'gray',
  suspended: 'red',
};

export function RealWorldExample() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredUsers = useMemo(() => {
    return filters.length > 0
      ? mockUsers.filter((_, i) => i < Math.max(2, mockUsers.length - filters.length))
      : mockUsers;
  }, [filters]);

  return (
    <Box p="xl" maw={1000} mx="auto">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs">
              <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                <IconUsers size={20} />
              </ThemeIcon>
              <Title order={2}>User Management</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Search and filter users by various criteria
            </Text>
          </div>
          <Badge size="lg" variant="filled" color="blue">
            {filteredUsers.length} users
          </Badge>
        </Group>

        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={userFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter users by name, email, role, status..."
            storageKeyPrefix="user-management"
          />
        </Card>

        <Card withBorder p={0} radius="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Joined</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((user) => (
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
                    <Badge 
                      variant="light" 
                      color={roleColors[user.role]} 
                      size="sm"
                      leftSection={roleIcons[user.role]}
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="dot" color={statusColors[user.status]} size="sm">
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {user.tags.map((tag) => (
                        <Badge key={tag} size="xs" variant="outline" color="gray">
                          {tag}
                        </Badge>
                      ))}
                      {user.tags.length === 0 && <Text size="xs" c="dimmed">—</Text>}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{user.joined}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {filteredUsers.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconUsers size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No users found</Text>
            <Text c="dimmed" size="sm">Try adjusting your filters</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

