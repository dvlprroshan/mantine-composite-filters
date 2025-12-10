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
  Box,
  SimpleGrid,
  Progress,
  ThemeIcon,
  RingProgress,
  Paper,
  Divider,
} from '@mantine/core';
import {
  IconUsers,
  IconCurrencyDollar,
  IconTrendingUp,
  IconPhone,
  IconMail,
  IconBuilding,
  IconCalendar,
  IconChartPie,
  IconFlame,
  IconTarget,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const leadFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Contact Name',
    type: 'text',
    placeholder: 'Search contacts...',
    operators: ['contains', 'starts_with', '='],
    icon: <IconUsers size={14} />,
  },
  {
    key: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Search companies...',
    operators: ['contains', 'starts_with', '='],
    icon: <IconBuilding size={14} />,
  },
  {
    key: 'stage',
    label: 'Pipeline Stage',
    type: 'select',
    options: [
      { value: 'new', label: '🆕 New Lead' },
      { value: 'contacted', label: '📞 Contacted' },
      { value: 'qualified', label: '✅ Qualified' },
      { value: 'proposal', label: '📝 Proposal Sent' },
      { value: 'negotiation', label: '🤝 Negotiation' },
      { value: 'closed_won', label: '🎉 Closed Won' },
      { value: 'closed_lost', label: '❌ Closed Lost' },
    ],
  },
  {
    key: 'deal_value',
    label: 'Deal Value ($)',
    type: 'number',
    placeholder: 'Enter amount...',
    operators: ['=', '>', '<', '>=', '<='],
    icon: <IconCurrencyDollar size={14} />,
  },
  {
    key: 'lead_score',
    label: 'Lead Score',
    type: 'select',
    options: [
      { value: 'hot', label: '🔥 Hot (80-100)' },
      { value: 'warm', label: '🌡️ Warm (50-79)' },
      { value: 'cold', label: '❄️ Cold (0-49)' },
    ],
    icon: <IconFlame size={14} />,
  },
  {
    key: 'source',
    label: 'Lead Source',
    type: 'multi_select',
    options: [
      { value: 'website', label: '🌐 Website' },
      { value: 'referral', label: '👥 Referral' },
      { value: 'linkedin', label: '💼 LinkedIn' },
      { value: 'trade_show', label: '🎪 Trade Show' },
      { value: 'cold_call', label: '📞 Cold Call' },
      { value: 'email_campaign', label: '📧 Email Campaign' },
    ],
  },
  {
    key: 'industry',
    label: 'Industry',
    type: 'multi_select',
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'finance', label: 'Finance' },
      { value: 'retail', label: 'Retail' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'education', label: 'Education' },
    ],
  },
  {
    key: 'owner',
    label: 'Sales Rep',
    type: 'select',
    options: [
      { value: 'alex', label: 'Alex Johnson' },
      { value: 'maria', label: 'Maria Garcia' },
      { value: 'david', label: 'David Kim' },
      { value: 'emma', label: 'Emma Wilson' },
    ],
  },
  {
    key: 'last_contact',
    label: 'Last Contact',
    type: 'date_range',
    icon: <IconCalendar size={14} />,
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'date',
  },
];

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    company: 'TechCorp Inc.',
    email: 'sarah@techcorp.com',
    stage: 'negotiation',
    dealValue: 85000,
    score: 92,
    source: 'LinkedIn',
    industry: 'Technology',
    owner: 'Alex Johnson',
    lastContact: '2 hours ago',
  },
  {
    id: 2,
    name: 'James Chen',
    company: 'HealthFirst',
    email: 'j.chen@healthfirst.org',
    stage: 'proposal',
    dealValue: 120000,
    score: 78,
    source: 'Referral',
    industry: 'Healthcare',
    owner: 'Maria Garcia',
    lastContact: '1 day ago',
  },
  {
    id: 3,
    name: 'Emily Brown',
    company: 'RetailMax',
    email: 'emily.b@retailmax.com',
    stage: 'qualified',
    dealValue: 45000,
    score: 65,
    source: 'Website',
    industry: 'Retail',
    owner: 'David Kim',
    lastContact: '3 days ago',
  },
  {
    id: 4,
    name: 'Michael Foster',
    company: 'EduLearn',
    email: 'm.foster@edulearn.edu',
    stage: 'contacted',
    dealValue: 32000,
    score: 45,
    source: 'Trade Show',
    industry: 'Education',
    owner: 'Emma Wilson',
    lastContact: '1 week ago',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    company: 'FinanceHub',
    email: 'lisa@financehub.com',
    stage: 'new',
    dealValue: 250000,
    score: 88,
    source: 'Cold Call',
    industry: 'Finance',
    owner: 'Alex Johnson',
    lastContact: 'Never',
  },
];

const stageColors: Record<string, string> = {
  new: 'blue',
  contacted: 'cyan',
  qualified: 'teal',
  proposal: 'green',
  negotiation: 'lime',
  closed_won: 'green',
  closed_lost: 'red',
};

function LeadCard({ lead }: { lead: typeof mockLeads[0] }) {
  const scoreColor = lead.score >= 80 ? 'red' : lead.score >= 50 ? 'yellow' : 'blue';
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar color="blue" radius="xl">{lead.name.split(' ').map(n => n[0]).join('')}</Avatar>
          <div>
            <Text fw={500}>{lead.name}</Text>
            <Text size="xs" c="dimmed">{lead.company}</Text>
          </div>
        </Group>
        <RingProgress
          size={50}
          thickness={5}
          roundCaps
          sections={[{ value: lead.score, color: scoreColor }]}
          label={
            <Text ta="center" size="xs" fw={700}>{lead.score}</Text>
          }
        />
      </Group>

      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Deal Value</Text>
          <Text size="sm" fw={600} c="green">${lead.dealValue.toLocaleString()}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Stage</Text>
          <Badge color={stageColors[lead.stage]} variant="light" size="sm">
            {lead.stage.replace('_', ' ')}
          </Badge>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Source</Text>
          <Text size="sm">{lead.source}</Text>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">Last Contact</Text>
          <Text size="sm" c="dimmed">{lead.lastContact}</Text>
        </Group>
      </Stack>

      <Divider my="sm" />

      <Group gap="xs">
        <ThemeIcon size="sm" variant="light" radius="xl" color="blue">
          <IconMail size={12} />
        </ThemeIcon>
        <ThemeIcon size="sm" variant="light" radius="xl" color="green">
          <IconPhone size={12} />
        </ThemeIcon>
        <Text size="xs" c="dimmed" ml="auto">
          {lead.owner}
        </Text>
      </Group>
    </Card>
  );
}

export function CRMLeadsDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredLeads = useMemo(() => {
    return filters.length > 0
      ? mockLeads.slice(0, Math.max(2, mockLeads.length - filters.length))
      : mockLeads;
  }, [filters]);

  const totalValue = filteredLeads.reduce((acc, lead) => acc + lead.dealValue, 0);
  const avgScore = Math.round(filteredLeads.reduce((acc, lead) => acc + lead.score, 0) / filteredLeads.length);

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                <IconTarget size={20} />
              </ThemeIcon>
              <Title order={2}>Sales Pipeline</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Manage your leads and track deal progress
            </Text>
          </div>
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                <IconUsers size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Total Leads</Text>
                <Text size="xl" fw={700}>{filteredLeads.length}</Text>
              </div>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <IconCurrencyDollar size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Pipeline Value</Text>
                <Text size="xl" fw={700}>${(totalValue / 1000).toFixed(0)}K</Text>
              </div>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                <IconFlame size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Avg. Lead Score</Text>
                <Text size="xl" fw={700}>{avgScore || 0}</Text>
              </div>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light" color="grape">
                <IconTrendingUp size={24} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed">Conversion Rate</Text>
                <Text size="xl" fw={700}>24%</Text>
              </div>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={leadFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter leads by name, company, stage, deal value..."
            storageKeyPrefix="crm-leads"
          />
        </Card>

        {/* Leads Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SimpleGrid>

        {filteredLeads.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconUsers size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No leads found</Text>
            <Text c="dimmed" size="sm">Adjust your filters to find matching leads</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
