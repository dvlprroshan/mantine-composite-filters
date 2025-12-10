import React, { useState } from 'react';
import { type ActiveFilter, type FilterDefinition, MultiFiltersInput } from 'mantine-composite-filters';
import { 
  Badge, 
  ActionIcon, 
  Stack, 
  SegmentedControl, 
  Text, 
  Group, 
  Paper,
  ThemeIcon,
  Box,
  Tooltip,
} from '@mantine/core';
import { 
  IconX, 
  IconFilter,
  IconUser,
  IconMail,
  IconToggleLeft,
  IconCalendar,
  IconHash,
  IconSparkles,
} from '@tabler/icons-react';

const filters: FilterDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', operators: ['contains', '='] },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]},
  { key: 'role', label: 'Role', type: 'multi_select', options: [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' },
  ]},
  { key: 'age', label: 'Age', type: 'number', operators: ['=', '>', '<'] },
  { key: 'joined', label: 'Joined', type: 'date' },
];

// Icon map for filter types
const typeIcons: Record<string, React.ReactNode> = {
  text: <IconUser size={12} />,
  email: <IconMail size={12} />,
  select: <IconToggleLeft size={12} />,
  multi_select: <IconSparkles size={12} />,
  number: <IconHash size={12} />,
  date: <IconCalendar size={12} />,
};

// Style 1: Gradient Pills
const GradientPill = ({ filter, onRemove }: { filter: ActiveFilter; onRemove: () => void }) => (
  <Badge
    size="lg"
    variant="gradient"
    gradient={{ from: 'violet', to: 'grape', deg: 135 }}
    rightSection={
      <ActionIcon size={16} radius="xl" variant="transparent" onClick={onRemove}>
        <IconX size={10} color="white" />
      </ActionIcon>
    }
    style={{ paddingRight: 4 }}
  >
    {filter.label}: {filter.displayValue}
  </Badge>
);

// Style 2: Outlined with Icon
const OutlinedPill = ({ filter, onRemove }: { filter: ActiveFilter; onRemove: () => void }) => (
  <Paper 
    withBorder 
    radius="xl" 
    px="sm" 
    py={4}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
  >
    <ThemeIcon size={18} radius="xl" variant="light" color="blue">
      {typeIcons[filter.type] || <IconFilter size={10} />}
    </ThemeIcon>
    <Text size="xs" fw={500}>{filter.label}</Text>
    <Text size="xs" c="dimmed">{filter.operator}</Text>
    <Text size="xs" fw={600} c="blue">{filter.displayValue}</Text>
    <ActionIcon size={16} radius="xl" variant="subtle" color="gray" onClick={onRemove}>
      <IconX size={10} />
    </ActionIcon>
  </Paper>
);

// Style 3: Minimal Tag
const MinimalPill = ({ filter, onRemove }: { filter: ActiveFilter; onRemove: () => void }) => (
  <Group 
    gap={4} 
    bg="gray.1" 
    px="xs" 
    py={2} 
    style={{ borderRadius: 4, display: 'inline-flex' }}
  >
    <Text size="xs" c="dimmed">{filter.label}:</Text>
    <Text size="xs" fw={500}>{filter.displayValue}</Text>
    <ActionIcon size={14} variant="transparent" color="gray" onClick={onRemove}>
      <IconX size={10} />
    </ActionIcon>
  </Group>
);

// Style 4: Colorful Cards
const CardPill = ({ filter, onRemove }: { filter: ActiveFilter; onRemove: () => void }) => {
  const colors = ['blue', 'green', 'orange', 'grape', 'teal', 'pink'];
  const color = colors[filter.key.length % colors.length];
  
  return (
    <Tooltip label={`${filter.label} ${filter.operator} ${filter.displayValue}`}>
      <Paper 
        shadow="xs" 
        px="sm" 
        py={6}
        radius="md"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          borderLeft: `3px solid var(--mantine-color-${color}-5)`,
        }}
      >
        <Box>
          <Text size="xs" c="dimmed" lh={1}>{filter.label}</Text>
          <Text size="sm" fw={600} lh={1.2}>{filter.displayValue}</Text>
        </Box>
        <ActionIcon size="sm" variant="subtle" color="gray" onClick={onRemove}>
          <IconX size={12} />
        </ActionIcon>
      </Paper>
    </Tooltip>
  );
};

const pillStyles = {
  gradient: GradientPill,
  outlined: OutlinedPill,
  minimal: MinimalPill,
  card: CardPill,
};

export function CustomPills() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [style, setStyle] = useState<string>('gradient');

  const PillComponent = pillStyles[style as keyof typeof pillStyles];

  return (
    <Stack gap="md" p="md">
      <SegmentedControl
        size="xs"
        value={style}
        onChange={setStyle}
        data={[
          { label: 'Gradient', value: 'gradient' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Card', value: 'card' },
        ]}
      />

      <MultiFiltersInput
        filters={filters}
        value={activeFilters}
        onChange={setActiveFilters}
        placeholder="Add filters to see custom pills..."
        renderPill={(filter, onRemove) => (
          <PillComponent filter={filter} onRemove={onRemove} />
        )}
      />

      {activeFilters.length === 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Add some filters to preview different pill styles
        </Text>
      )}
    </Stack>
  );
}

