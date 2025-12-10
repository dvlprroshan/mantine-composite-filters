import React, { useState, useMemo } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Box,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Progress,
  RingProgress,
} from '@mantine/core';
import {
  IconChartBar,
  IconUsers,
  IconEye,
  IconClick,
  IconClock,
  IconWorld,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandChrome,
  IconBrandSafari,
  IconBrandFirefox,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const analyticsFilters: FilterDefinition[] = [
  {
    key: 'page_path',
    label: 'Page URL',
    type: 'text',
    placeholder: '/path/to/page',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'date_range',
    label: 'Date Range',
    type: 'date_range',
    icon: <IconClock size={14} />,
  },
  {
    key: 'country',
    label: 'Country',
    type: 'multi_select',
    options: [
      { value: 'us', label: '🇺🇸 United States' },
      { value: 'uk', label: '🇬🇧 United Kingdom' },
      { value: 'de', label: '🇩🇪 Germany' },
      { value: 'fr', label: '🇫🇷 France' },
      { value: 'jp', label: '🇯🇵 Japan' },
      { value: 'ca', label: '🇨🇦 Canada' },
      { value: 'au', label: '🇦🇺 Australia' },
    ],
    icon: <IconWorld size={14} />,
  },
  {
    key: 'device',
    label: 'Device Type',
    type: 'select',
    options: [
      { value: 'desktop', label: '🖥️ Desktop' },
      { value: 'mobile', label: '📱 Mobile' },
      { value: 'tablet', label: '📱 Tablet' },
    ],
  },
  {
    key: 'browser',
    label: 'Browser',
    type: 'multi_select',
    options: [
      { value: 'chrome', label: 'Chrome' },
      { value: 'safari', label: 'Safari' },
      { value: 'firefox', label: 'Firefox' },
      { value: 'edge', label: 'Edge' },
    ],
  },
  {
    key: 'traffic_source',
    label: 'Traffic Source',
    type: 'select',
    options: [
      { value: 'organic', label: '🔍 Organic Search' },
      { value: 'direct', label: '🔗 Direct' },
      { value: 'referral', label: '↩️ Referral' },
      { value: 'social', label: '📱 Social Media' },
      { value: 'paid', label: '💰 Paid Ads' },
      { value: 'email', label: '📧 Email' },
    ],
  },
  {
    key: 'page_views',
    label: 'Page Views',
    type: 'number',
    placeholder: 'Min page views...',
    operators: ['>', '>=', '<', '<=', '='],
  },
  {
    key: 'bounce_rate',
    label: 'Bounce Rate (%)',
    type: 'number',
    placeholder: 'Max bounce rate...',
    operators: ['<', '<=', '>', '>='],
  },
];

// Mock metrics
const mockMetrics = {
  visitors: 24582,
  pageViews: 89432,
  avgSessionDuration: '4m 32s',
  bounceRate: 42.3,
  topPages: [
    { path: '/dashboard', views: 12450, change: '+12%' },
    { path: '/products', views: 8923, change: '+8%' },
    { path: '/pricing', views: 6234, change: '+15%' },
    { path: '/blog/react-tips', views: 4521, change: '-3%' },
  ],
  deviceSplit: { desktop: 58, mobile: 35, tablet: 7 },
  browserSplit: { chrome: 62, safari: 21, firefox: 10, other: 7 },
};

export function AnalyticsDashboardDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const metrics = useMemo(() => {
    // Simulate filter affecting metrics
    const factor = filters.length > 0 ? 0.7 : 1;
    return {
      ...mockMetrics,
      visitors: Math.floor(mockMetrics.visitors * factor),
      pageViews: Math.floor(mockMetrics.pageViews * factor),
    };
  }, [filters]);

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
                <IconChartBar size={20} />
              </ThemeIcon>
              <Title order={2}>Analytics Dashboard</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Analyze website traffic and user behavior
            </Text>
          </div>
          <Badge size="lg" variant="light" color="grape">
            Last 30 days
          </Badge>
        </Group>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={analyticsFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter analytics by date, country, device, traffic source..."
            storageKeyPrefix="analytics-dashboard"
          />
        </Card>

        {/* Key Metrics */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Visitors</Text>
                <Text size="xl" fw={700}>{metrics.visitors.toLocaleString()}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="blue">
                <IconUsers size={24} />
              </ThemeIcon>
            </Group>
            <Badge size="xs" color="green" variant="light" mt="xs">+12.5%</Badge>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Page Views</Text>
                <Text size="xl" fw={700}>{metrics.pageViews.toLocaleString()}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <IconEye size={24} />
              </ThemeIcon>
            </Group>
            <Badge size="xs" color="green" variant="light" mt="xs">+8.2%</Badge>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Avg. Session</Text>
                <Text size="xl" fw={700}>{metrics.avgSessionDuration}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="orange">
                <IconClock size={24} />
              </ThemeIcon>
            </Group>
            <Badge size="xs" color="green" variant="light" mt="xs">+1.2%</Badge>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Bounce Rate</Text>
                <Text size="xl" fw={700}>{metrics.bounceRate}%</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="red">
                <IconClick size={24} />
              </ThemeIcon>
            </Group>
            <Badge size="xs" color="red" variant="light" mt="xs">-2.3%</Badge>
          </Paper>
        </SimpleGrid>

        {/* Charts Row */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {/* Top Pages */}
          <Card withBorder p="md" radius="md">
            <Text fw={600} mb="md">Top Pages</Text>
            <Stack gap="sm">
              {metrics.topPages.map((page, i) => (
                <Group key={page.path} justify="space-between">
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">{i + 1}.</Text>
                    <Text size="sm" fw={500}>{page.path}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm">{page.views.toLocaleString()}</Text>
                    <Badge 
                      size="xs" 
                      color={page.change.startsWith('+') ? 'green' : 'red'}
                      variant="light"
                    >
                      {page.change}
                    </Badge>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Device & Browser Split */}
          <Card withBorder p="md" radius="md">
            <Text fw={600} mb="md">Traffic Breakdown</Text>
            <SimpleGrid cols={2} spacing="md">
              <div>
                <Text size="xs" c="dimmed" mb="xs">By Device</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconDeviceDesktop size={14} />
                      <Text size="sm">Desktop</Text>
                    </Group>
                    <Text size="sm" fw={500}>{metrics.deviceSplit.desktop}%</Text>
                  </Group>
                  <Progress value={metrics.deviceSplit.desktop} color="blue" size="sm" />
                  
                  <Group justify="space-between" mt="xs">
                    <Group gap="xs">
                      <IconDeviceMobile size={14} />
                      <Text size="sm">Mobile</Text>
                    </Group>
                    <Text size="sm" fw={500}>{metrics.deviceSplit.mobile}%</Text>
                  </Group>
                  <Progress value={metrics.deviceSplit.mobile} color="green" size="sm" />
                </Stack>
              </div>
              <div>
                <Text size="xs" c="dimmed" mb="xs">By Browser</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconBrandChrome size={14} />
                      <Text size="sm">Chrome</Text>
                    </Group>
                    <Text size="sm" fw={500}>{metrics.browserSplit.chrome}%</Text>
                  </Group>
                  <Progress value={metrics.browserSplit.chrome} color="orange" size="sm" />
                  
                  <Group justify="space-between" mt="xs">
                    <Group gap="xs">
                      <IconBrandSafari size={14} />
                      <Text size="sm">Safari</Text>
                    </Group>
                    <Text size="sm" fw={500}>{metrics.browserSplit.safari}%</Text>
                  </Group>
                  <Progress value={metrics.browserSplit.safari} color="cyan" size="sm" />
                </Stack>
              </div>
            </SimpleGrid>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
