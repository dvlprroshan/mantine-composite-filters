import React, { useState, useMemo } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Avatar,
  Table,
  Box,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Anchor,
} from '@mantine/core';
import {
  IconBug,
  IconSparkles,
  IconRocket,
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconUser,
  IconGitPullRequest,
  IconMessageCircle,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const issueFilters: FilterDefinition[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Search issues...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'bug', label: '🐛 Bug' },
      { value: 'feature', label: '✨ Feature' },
      { value: 'improvement', label: '🚀 Improvement' },
      { value: 'task', label: '📋 Task' },
      { value: 'docs', label: '📚 Documentation' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'open', label: '🟢 Open' },
      { value: 'in_progress', label: '🔵 In Progress' },
      { value: 'review', label: '🟡 In Review' },
      { value: 'closed', label: '⚫ Closed' },
      { value: 'blocked', label: '🔴 Blocked' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'critical', label: '🔥 Critical' },
      { value: 'high', label: '⬆️ High' },
      { value: 'medium', label: '➡️ Medium' },
      { value: 'low', label: '⬇️ Low' },
    ],
  },
  {
    key: 'assignee',
    label: 'Assignee',
    type: 'multi_select',
    options: [
      { value: 'john', label: 'John Doe' },
      { value: 'jane', label: 'Jane Smith' },
      { value: 'mike', label: 'Mike Wilson' },
      { value: 'sarah', label: 'Sarah Connor' },
      { value: 'unassigned', label: 'Unassigned' },
    ],
    icon: <IconUser size={14} />,
  },
  {
    key: 'labels',
    label: 'Labels',
    type: 'multi_select',
    options: [
      { value: 'frontend', label: 'frontend' },
      { value: 'backend', label: 'backend' },
      { value: 'api', label: 'api' },
      { value: 'security', label: 'security' },
      { value: 'performance', label: 'performance' },
      { value: 'ux', label: 'ux' },
      { value: 'good-first-issue', label: 'good first issue' },
    ],
  },
  {
    key: 'created_at',
    label: 'Created',
    type: 'date_range',
  },
  {
    key: 'updated_at',
    label: 'Last Updated',
    type: 'date',
  },
];

// Mock issues data
const mockIssues = [
  {
    id: 1234,
    title: 'Fix authentication redirect loop on mobile Safari',
    type: 'bug',
    status: 'in_progress',
    priority: 'critical',
    assignee: { name: 'John Doe', avatar: 'JD' },
    labels: ['frontend', 'security'],
    comments: 12,
    created: '2 hours ago',
  },
  {
    id: 1233,
    title: 'Add dark mode support for dashboard',
    type: 'feature',
    status: 'review',
    priority: 'high',
    assignee: { name: 'Jane Smith', avatar: 'JS' },
    labels: ['frontend', 'ux'],
    comments: 8,
    created: '1 day ago',
  },
  {
    id: 1232,
    title: 'Optimize database queries for user search',
    type: 'improvement',
    status: 'open',
    priority: 'medium',
    assignee: { name: 'Mike Wilson', avatar: 'MW' },
    labels: ['backend', 'performance'],
    comments: 3,
    created: '2 days ago',
  },
  {
    id: 1231,
    title: 'Update API documentation for v2 endpoints',
    type: 'task',
    status: 'open',
    priority: 'low',
    assignee: null,
    labels: ['api', 'good-first-issue'],
    comments: 0,
    created: '3 days ago',
  },
  {
    id: 1230,
    title: 'Memory leak in WebSocket connection handler',
    type: 'bug',
    status: 'blocked',
    priority: 'high',
    assignee: { name: 'Sarah Connor', avatar: 'SC' },
    labels: ['backend', 'security'],
    comments: 15,
    created: '1 week ago',
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  bug: <IconBug size={16} color="#fa5252" />,
  feature: <IconSparkles size={16} color="#7950f2" />,
  improvement: <IconRocket size={16} color="#228be6" />,
  task: <IconClock size={16} color="#868e96" />,
  docs: <IconGitPullRequest size={16} color="#40c057" />,
};

const statusColors: Record<string, string> = {
  open: 'green',
  in_progress: 'blue',
  review: 'yellow',
  closed: 'gray',
  blocked: 'red',
};

const priorityColors: Record<string, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'gray',
};

export function IssueTrackerDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredIssues = useMemo(() => {
    return filters.length > 0
      ? mockIssues.filter((_, i) => i % (filters.length + 1) === 0 || i < 3)
      : mockIssues;
  }, [filters]);

  const openCount = filteredIssues.filter((i) => i.status === 'open' || i.status === 'in_progress').length;
  const closedCount = filteredIssues.filter((i) => i.status === 'closed').length;

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <ThemeIcon size="lg" radius="md" variant="light" color="grape">
                <IconBug size={20} />
              </ThemeIcon>
              <Title order={2}>Issue Tracker</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Track, prioritize, and resolve issues across your project
            </Text>
          </div>
          <Group gap="xs">
            <Badge color="green" variant="light" size="lg" leftSection={<IconAlertCircle size={12} />}>
              {openCount} Open
            </Badge>
            <Badge color="gray" variant="light" size="lg" leftSection={<IconCircleCheck size={12} />}>
              {closedCount} Closed
            </Badge>
          </Group>
        </Group>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={issueFilters}
            value={filters}
            onChange={setFilters}
            placeholder="Filter issues by type, status, priority, assignee..."
            storageKeyPrefix="issue-tracker"
            maxFilters={8}
          />
        </Card>

        {/* Issues Table */}
        <Card withBorder p={0} radius="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Issue</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th>Assignee</Table.Th>
                <Table.Th>Labels</Table.Th>
                <Table.Th ta="right">Activity</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredIssues.map((issue) => (
                <Table.Tr key={issue.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      {typeIcons[issue.type]}
                      <div>
                        <Anchor size="sm" fw={500} c="dark" style={{ cursor: 'pointer' }}>
                          {issue.title}
                        </Anchor>
                        <Text size="xs" c="dimmed">
                          #{issue.id} opened {issue.created}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[issue.status]} variant="light" size="sm">
                      {issue.status.replace('_', ' ')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={priorityColors[issue.priority]} variant="dot" size="sm">
                      {issue.priority}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {issue.assignee ? (
                      <Tooltip label={issue.assignee.name}>
                        <Avatar size="sm" radius="xl" color="blue">
                          {issue.assignee.avatar}
                        </Avatar>
                      </Tooltip>
                    ) : (
                      <Text size="xs" c="dimmed">Unassigned</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {issue.labels.slice(0, 2).map((label) => (
                        <Badge key={label} size="xs" variant="outline" color="gray">
                          {label}
                        </Badge>
                      ))}
                      {issue.labels.length > 2 && (
                        <Badge size="xs" variant="filled" color="gray">
                          +{issue.labels.length - 2}
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <Group gap={4}>
                        <IconMessageCircle size={14} color="gray" />
                        <Text size="xs" c="dimmed">{issue.comments}</Text>
                      </Group>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {filteredIssues.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconCircleCheck size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No issues match your filters</Text>
            <Text c="dimmed" size="sm">Try removing some filters or search for something else</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
