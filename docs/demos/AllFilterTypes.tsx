import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Card, Text, Badge, Group, Stack, SimpleGrid, ThemeIcon, Paper, Flex } from '@mantine/core';
import {
  IconLetterCase,
  IconAt,
  IconHash,
  IconSelect,
  IconCheckbox,
  IconCalendar,
  IconCalendarStats,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

// Showcase all 7 filter types with realistic examples
const allTypesFilters: FilterDefinition[] = [
  {
    key: 'product_name',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Search products...',
    operators: ['contains', 'starts_with', 'ends_with', '='],
    icon: <IconLetterCase size={14} />,
  },
  {
    key: 'customer_email',
    label: 'Customer Email',
    type: 'email',
    placeholder: 'customer@example.com',
    icon: <IconAt size={14} />,
  },
  {
    key: 'order_total',
    label: 'Order Total ($)',
    type: 'number',
    placeholder: 'Enter amount...',
    operators: ['=', '!=', '>', '<', '>=', '<='],
    icon: <IconHash size={14} />,
  },
  {
    key: 'payment_status',
    label: 'Payment Status',
    type: 'select',
    options: [
      { value: 'paid', label: '✅ Paid' },
      { value: 'pending', label: '⏳ Pending' },
      { value: 'failed', label: '❌ Failed' },
      { value: 'refunded', label: '↩️ Refunded' },
    ],
    icon: <IconSelect size={14} />,
  },
  {
    key: 'shipping_regions',
    label: 'Shipping Regions',
    type: 'multi_select',
    options: [
      { value: 'north_america', label: '🇺🇸 North America' },
      { value: 'europe', label: '🇪🇺 Europe' },
      { value: 'asia', label: '🌏 Asia Pacific' },
      { value: 'latin_america', label: '🌎 Latin America' },
    ],
    icon: <IconCheckbox size={14} />,
  },
  {
    key: 'order_date',
    label: 'Order Date',
    type: 'date',
    icon: <IconCalendar size={14} />,
  },
  {
    key: 'delivery_window',
    label: 'Delivery Window',
    type: 'date_range',
    icon: <IconCalendarStats size={14} />,
  },
];

const filterTypeInfo = [
  { type: 'text', icon: IconLetterCase, color: 'blue', desc: 'Free text with operators' },
  { type: 'email', icon: IconAt, color: 'cyan', desc: 'Email validation' },
  { type: 'number', icon: IconHash, color: 'green', desc: 'Numeric comparisons' },
  { type: 'select', icon: IconSelect, color: 'grape', desc: 'Single choice' },
  { type: 'multi_select', icon: IconCheckbox, color: 'orange', desc: 'Multiple choices' },
  { type: 'date', icon: IconCalendar, color: 'pink', desc: 'Date picker' },
  { type: 'date_range', icon: IconCalendarStats, color: 'teal', desc: 'Date range picker' },
];

export function AllFilterTypes() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="lg" p="xl" maw={1000}>
      {/* Filter types legend */}
      <Flex gap="xs" wrap="wrap">
        {filterTypeInfo.map(({ type, icon: Icon, color, desc }) => (
          <Paper key={type} withBorder p="xs" radius="md">
            <Group gap="xs" wrap="nowrap">
              <ThemeIcon size="sm" variant="light" color={color} radius="xl">
                <Icon size={12} />
              </ThemeIcon>
              <div>
                <Text size="xs" fw={600}>{type}</Text>
                <Text size="xs" c="dimmed" lineClamp={1}>{desc}</Text>
              </div>
            </Group>
          </Paper>
        ))}
      </Flex>

      {/* The filter component */}
      <Card withBorder p="md" radius="md">
        <MultiFiltersInput
          filters={allTypesFilters}
          value={filters}
          onChange={setFilters}
          placeholder="🎯 Try each filter type - text, email, number, select, multi-select, date, date range..."
        />
      </Card>

      {/* Active filters display */}
      {filters.length > 0 && (
        <Card withBorder padding="md" radius="md">
          <Text fw={600} size="sm" mb="sm">Applied Filters</Text>
          <Group gap="xs">
            {filters.map((filter) => (
              <Badge 
                key={filter.id} 
                variant="light" 
                size="lg"
                leftSection={
                  <Text span size="xs" c="dimmed">{filter.type}:</Text>
                }
              >
                {filter.label} {filter.operator} {filter.displayValue}
              </Badge>
            ))}
          </Group>
        </Card>
      )}
    </Stack>
  );
}

