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
  Timeline,
  Box,
  ThemeIcon,
  Paper,
  Divider,
  SimpleGrid,
  Progress,
  Tooltip,
} from '@mantine/core';
import {
  IconHeadset,
  IconTicket,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconMessage,
  IconUser,
  IconMoodSmile,
  IconMoodSad,
  IconMoodNeutral,
  IconStar,
  IconFlame,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const ticketFilters: FilterDefinition[] = [
  {
    key: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'Search tickets...',
    operators: ['contains', 'starts_with', '='],
    icon: <IconTicket size={14} />,
  },
  {
    key: 'customer_email',
    label: 'Customer Email',
    type: 'email',
    placeholder: 'customer@email.com',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'new', label: '🆕 New' },
      { value: 'open', label: '📂 Open' },
      { value: 'pending', label: '⏳ Pending Customer' },
      { value: 'on_hold', label: '⏸️ On Hold' },
      { value: 'solved', label: '✅ Solved' },
      { value: 'closed', label: '🔒 Closed' },
    ],
  },
  {
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'urgent', label: '🔴 Urgent' },
      { value: 'high', label: '🟠 High' },
      { value: 'normal', label: '🟡 Normal' },
      { value: 'low', label: '🟢 Low' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'billing', label: '💳 Billing' },
      { value: 'technical', label: '🔧 Technical Support' },
      { value: 'account', label: '👤 Account' },
      { value: 'feature', label: '💡 Feature Request' },
      { value: 'bug', label: '🐛 Bug Report' },
      { value: 'general', label: '📋 General Inquiry' },
    ],
  },
  {
    key: 'agent',
    label: 'Assigned Agent',
    type: 'multi_select',
    options: [
      { value: 'tom', label: 'Tom Anderson' },
      { value: 'lucy', label: 'Lucy Martinez' },
      { value: 'raj', label: 'Raj Patel' },
      { value: 'anna', label: 'Anna Schmidt' },
      { value: 'unassigned', label: 'Unassigned' },
    ],
    icon: <IconHeadset size={14} />,
  },
  {
    key: 'channel',
    label: 'Channel',
    type: 'multi_select',
    options: [
      { value: 'email', label: '📧 Email' },
      { value: 'chat', label: '💬 Live Chat' },
      { value: 'phone', label: '📞 Phone' },
      { value: 'social', label: '📱 Social Media' },
      { value: 'form', label: '📝 Contact Form' },
    ],
  },
  {
    key: 'satisfaction',
    label: 'Satisfaction',
    type: 'select',
    options: [
      { value: 'good', label: '😊 Good' },
      { value: 'neutral', label: '😐 Neutral' },
      { value: 'bad', label: '😞 Bad' },
      { value: 'unrated', label: '❓ Unrated' },
    ],
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'date_range',
    icon: <IconClock size={14} />,
  },
  {
    key: 'response_time',
    label: 'First Response (hours)',
    type: 'number',
    placeholder: 'Hours...',
    operators: ['<', '<=', '>', '>='],
  },
];

// Mock tickets data
const mockTickets = [
  {
    id: 'TKT-4521',
    subject: 'Unable to process payment - card declined error',
    customer: { name: 'Robert Chen', email: 'r.chen@email.com' },
    status: 'open',
    priority: 'urgent',
    category: 'billing',
    agent: { name: 'Tom Anderson', avatar: 'TA' },
    channel: 'email',
    satisfaction: null,
    created: '15 min ago',
    responses: 2,
    sla: 'breaching',
  },
  {
    id: 'TKT-4520',
    subject: 'Feature request: Dark mode for mobile app',
    customer: { name: 'Emily Watson', email: 'emily.w@company.org' },
    status: 'pending',
    priority: 'normal',
    category: 'feature',
    agent: { name: 'Lucy Martinez', avatar: 'LM' },
    channel: 'chat',
    satisfaction: 'good',
    created: '2 hours ago',
    responses: 5,
    sla: 'ok',
  },
  {
    id: 'TKT-4519',
    subject: 'Login issues after password reset',
    customer: { name: 'Marcus Johnson', email: 'marcus.j@gmail.com' },
    status: 'solved',
    priority: 'high',
    category: 'account',
    agent: { name: 'Raj Patel', avatar: 'RP' },
    channel: 'phone',
    satisfaction: 'good',
    created: '1 day ago',
    responses: 8,
    sla: 'ok',
  },
  {
    id: 'TKT-4518',
    subject: 'API returning 500 errors on POST requests',
    customer: { name: 'Sarah Developer', email: 'sarah@devcompany.io' },
    status: 'open',
    priority: 'high',
    category: 'bug',
    agent: { name: 'Anna Schmidt', avatar: 'AS' },
    channel: 'form',
    satisfaction: null,
    created: '3 hours ago',
    responses: 3,
    sla: 'warning',
  },
  {
    id: 'TKT-4517',
    subject: 'How to export data to CSV?',
    customer: { name: 'Mike Brown', email: 'mike.brown@email.com' },
    status: 'closed',
    priority: 'low',
    category: 'general',
    agent: null,
    channel: 'social',
    satisfaction: 'neutral',
    created: '2 days ago',
    responses: 1,
    sla: 'ok',
  },
];

const statusColors: Record<string, string> = {
  new: 'blue',
  open: 'cyan',
  pending: 'yellow',
  on_hold: 'orange',
  solved: 'green',
  closed: 'gray',
};

const priorityColors: Record<string, string> = {
  urgent: 'red',
  high: 'orange',
  normal: 'yellow',
  low: 'green',
};

const satisfactionIcons: Record<string, React.ReactNode> = {
  good: <IconMoodSmile size={16} color="#40c057" />,
  neutral: <IconMoodNeutral size={16} color="#fab005" />,
  bad: <IconMoodSad size={16} color="#fa5252" />,
};

function TicketCard({ ticket }: { ticket: typeof mockTickets[0] }) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Badge variant="light" color={priorityColors[ticket.priority]} size="sm">
          {ticket.priority}
        </Badge>
        <Group gap={4}>
          {ticket.sla === 'breaching' && (
            <Tooltip label="SLA Breaching!">
              <ThemeIcon size="sm" color="red" variant="light" radius="xl">
                <IconFlame size={12} />
              </ThemeIcon>
            </Tooltip>
          )}
          {ticket.sla === 'warning' && (
            <Tooltip label="SLA Warning">
              <ThemeIcon size="sm" color="yellow" variant="light" radius="xl">
                <IconAlertTriangle size={12} />
              </ThemeIcon>
            </Tooltip>
          )}
          <Text size="xs" c="dimmed">{ticket.id}</Text>
        </Group>
      </Group>

      <Text fw={500} size="sm" lineClamp={2} mb="xs">
        {ticket.subject}
      </Text>

      <Group gap="xs" mb="md">
        <Avatar size="xs" radius="xl" color="gray">
          {ticket.customer.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Text size="xs" c="dimmed" lineClamp={1}>{ticket.customer.email}</Text>
      </Group>

      <Divider mb="sm" />

      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Badge color={statusColors[ticket.status]} variant="dot" size="xs">
            {ticket.status.replace('_', ' ')}
          </Badge>
          {ticket.satisfaction && satisfactionIcons[ticket.satisfaction]}
        </Group>
        <Group gap="xs">
          {ticket.agent ? (
            <Tooltip label={ticket.agent.name}>
              <Avatar size="xs" radius="xl" color="blue">
                {ticket.agent.avatar}
              </Avatar>
            </Tooltip>
          ) : (
            <Badge size="xs" color="gray" variant="outline">Unassigned</Badge>
          )}
        </Group>
      </Group>

      <Group justify="space-between" mt="xs">
        <Text size="xs" c="dimmed">
          <IconMessage size={12} style={{ verticalAlign: 'middle' }} /> {ticket.responses}
        </Text>
        <Text size="xs" c="dimmed">{ticket.created}</Text>
      </Group>
    </Card>
  );
}

export function HelpDeskDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredTickets = useMemo(() => {
    return filters.length > 0
      ? mockTickets.filter((_, i) => i < Math.max(2, mockTickets.length - filters.length))
      : mockTickets;
  }, [filters]);

  const openTickets = filteredTickets.filter(t => ['new', 'open', 'pending'].includes(t.status)).length;
  const solvedToday = filteredTickets.filter(t => t.status === 'solved').length;
  const avgSatisfaction = 87;

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'teal', to: 'lime' }}>
                <IconHeadset size={20} />
              </ThemeIcon>
              <Title order={2}>Help Desk</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Support ticket management and customer satisfaction
            </Text>
          </div>
        </Group>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Open Tickets</Text>
                <Text size="xl" fw={700}>{openTickets}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                <IconTicket size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Solved Today</Text>
                <Text size="xl" fw={700}>{solvedToday}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <IconCheck size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Avg Response</Text>
                <Text size="xl" fw={700}>2.4h</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                <IconClock size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Satisfaction</Text>
                <Text size="xl" fw={700}>{avgSatisfaction}%</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="grape">
                <IconMoodSmile size={24} />
              </ThemeIcon>
            </Group>
            <Progress value={avgSatisfaction} color="grape" size="sm" mt="xs" />
          </Paper>
        </SimpleGrid>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={ticketFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter tickets by status, priority, category, agent..."
            storageKeyPrefix="helpdesk-tickets"
            maxFilters={10}
          />
        </Card>

        {/* Tickets Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SimpleGrid>

        {filteredTickets.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconTicket size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No tickets found</Text>
            <Text c="dimmed" size="sm">Try adjusting your filter criteria</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
