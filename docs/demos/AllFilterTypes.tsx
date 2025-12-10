import React, { useState } from 'react';
import { type ActiveFilter, type FilterDefinition, MultiFiltersInput } from 'mantine-composite-filters';
import { Stack, Badge, Group } from '@mantine/core';

// All 7 filter types
const allFilters: FilterDefinition[] = [
  {
    key: 'text_field',
    label: 'Text',
    type: 'text',
    placeholder: 'Enter text...',
    operators: ['contains', 'starts_with', 'ends_with', '='],
  },
  {
    key: 'email_field',
    label: 'Email',
    type: 'email',
    placeholder: 'user@email.com',
  },
  {
    key: 'number_field',
    label: 'Number',
    type: 'number',
    placeholder: 'Enter number...',
    operators: ['=', '!=', '>', '<', '>=', '<='],
  },
  {
    key: 'select_field',
    label: 'Select',
    type: 'select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  {
    key: 'multi_select_field',
    label: 'Multi Select',
    type: 'multi_select',
    options: [
      { value: 'tag1', label: 'Tag 1' },
      { value: 'tag2', label: 'Tag 2' },
      { value: 'tag3', label: 'Tag 3' },
    ],
  },
  {
    key: 'date_field',
    label: 'Date',
    type: 'date',
  },
  {
    key: 'date_range_field',
    label: 'Date Range',
    type: 'date_range',
  },
];

const typeDescriptions = {
  text: 'Free text input with operators',
  email: 'Email with validation',
  number: 'Numeric with comparison operators',
  select: 'Single choice dropdown',
  multi_select: 'Multiple choice selection',
  date: 'Single date picker',
  date_range: 'Date range picker',
};

export function AllFilterTypes() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <Stack gap="md" p="md">
      {/* Type badges */}
      <Group gap="xs">
        {Object.entries(typeDescriptions).map(([type, desc]) => (
          <Badge key={type} variant="light" size="sm" title={desc}>
            {type}
          </Badge>
        ))}
      </Group>

      <MultiFiltersInput
        filters={allFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Try each filter type..."
      />

      {filters.length > 0 && (
        <Group gap="xs">
          {filters.map((f) => (
            <Badge key={f.id} variant="outline">
              {f.label}: {f.displayValue}
            </Badge>
          ))}
        </Group>
      )}
    </Stack>
  );
}

