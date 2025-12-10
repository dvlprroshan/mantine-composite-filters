import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Card, Text, Badge, Group, Stack, Code } from '@mantine/core';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

// Define your filter schema - this is what fields users can filter by
const employeeFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Employee Name',
    type: 'text',
    placeholder: 'Search by name...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'email',
    label: 'Work Email',
    type: 'email',
    placeholder: 'name@company.com',
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'engineering', label: '💻 Engineering' },
      { value: 'design', label: '🎨 Design' },
      { value: 'marketing', label: '📢 Marketing' },
      { value: 'sales', label: '💼 Sales' },
      { value: 'hr', label: '👥 Human Resources' },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multi_select',
    options: [
      { value: 'react', label: 'React' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'figma', label: 'Figma' },
      { value: 'sql', label: 'SQL' },
    ],
  },
  {
    key: 'salary',
    label: 'Salary ($)',
    type: 'number',
    placeholder: 'Enter amount...',
    operators: ['=', '>', '<', '>=', '<='],
  },
  {
    key: 'hire_date',
    label: 'Hire Date',
    type: 'date_range',
  },
];

export function Usage() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="lg" p="xl" maw={900}>
      {/* The filter component */}
      <MultiFiltersInput
        filters={employeeFilters}
        value={filters}
        onChange={setFilters}
        placeholder="🔍 Filter employees by name, department, skills..."
      />

      {/* Show active filters as output */}
      {filters.length > 0 && (
        <Card withBorder padding="md" radius="md" bg="gray.0">
          <Group mb="xs">
            <Text fw={600} size="sm">Active Filters</Text>
            <Badge variant="light">{filters.length}</Badge>
          </Group>
          <Code block style={{ maxHeight: 200, overflow: 'auto' }}>
            {JSON.stringify(filters, null, 2)}
          </Code>
        </Card>
      )}

      {filters.length === 0 && (
        <Text c="dimmed" size="sm" ta="center">
          Click on the input and start typing to add filters
        </Text>
      )}
    </Stack>
  );
}

