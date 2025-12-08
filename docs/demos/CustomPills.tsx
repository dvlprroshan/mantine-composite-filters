import React, { useState } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import { Badge, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const sampleFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name...',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email...',
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
];

export function CustomPills() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <MultiFiltersInput
        filters={sampleFilters}
        value={filters}
        onChange={setFilters}
        placeholder="Filter by..."
        renderPill={(filter, onRemove) => (
          <Badge
            key={filter.id}
            size="lg"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            rightSection={
              <ActionIcon
                size="xs"
                color="blue"
                radius="xl"
                variant="transparent"
                onClick={onRemove}
                style={{ marginLeft: 4 }}
              >
                <IconX size={12} />
              </ActionIcon>
            }
          >
            {filter.label} {filter.operator} {filter.displayValue}
          </Badge>
        )}
      />
    </div>
  );
}

