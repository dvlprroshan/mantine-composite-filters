import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { CompositeFiltersInput, type ActiveFilter, type FilterDefinition } from '../../index';

const mockFilters: FilterDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    operators: ['=', '>', '<'],
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
  {
    key: 'tags',
    label: 'Tags',
    type: 'multi_select',
    options: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'important', label: 'Important' },
    ],
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'date',
  },
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('CompositeFiltersInput', () => {
  it('renders without crashing', () => {
    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={() => {}} />
      </Wrapper>
    );
    expect(screen.getByPlaceholderText(/filter by/i)).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(
      <Wrapper>
        <CompositeFiltersInput
          filters={mockFilters}
          value={[]}
          onChange={() => {}}
          placeholder="Custom placeholder"
        />
      </Wrapper>
    );
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={() => {}} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  it('displays active filters as pills', () => {
    const activeFilters: ActiveFilter[] = [
      {
        id: '1',
        key: 'name',
        label: 'Name',
        type: 'text',
        operator: 'contains',
        value: 'John',
        displayValue: 'John',
      },
    ];

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={activeFilters} onChange={() => {}} />
      </Wrapper>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('calls onChange when filter is added', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={handleChange} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Name'));

    await waitFor(() => {
      const valueInput = screen.getByPlaceholderText(/enter/i);
      expect(valueInput).toBeInTheDocument();
    });

    const valueInput = screen.getByPlaceholderText(/enter/i);
    await user.type(valueInput, 'John');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      const callArgs = handleChange.mock.calls[0][0];
      expect(callArgs).toHaveLength(1);
      expect(callArgs[0].key).toBe('name');
      expect(callArgs[0].value).toBe('John');
    });
  });

  it('removes filter when pill remove button is clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const activeFilters: ActiveFilter[] = [
      {
        id: '1',
        key: 'name',
        label: 'Name',
        type: 'text',
        operator: 'contains',
        value: 'John',
        displayValue: 'John',
      },
    ];

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={activeFilters} onChange={handleChange} />
      </Wrapper>
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('disables input when maxFilters is reached', () => {
    const activeFilters: ActiveFilter[] = [
      {
        id: '1',
        key: 'name',
        label: 'Name',
        type: 'text',
        operator: 'contains',
        value: 'John',
        displayValue: 'John',
      },
      {
        id: '2',
        key: 'email',
        label: 'Email',
        type: 'email',
        operator: 'contains',
        value: 'test@example.com',
        displayValue: 'test@example.com',
      },
      {
        id: '3',
        key: 'age',
        label: 'Age',
        type: 'number',
        operator: '=',
        value: '25',
        displayValue: '25',
      },
    ];

    render(
      <Wrapper>
        <CompositeFiltersInput
          filters={mockFilters}
          value={activeFilters}
          onChange={() => {}}
          maxFilters={3}
        />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    expect(input).toBeDisabled();
  });

  it('displays max filters reached message', () => {
    const activeFilters: ActiveFilter[] = [
      {
        id: '1',
        key: 'name',
        label: 'Name',
        type: 'text',
        operator: 'contains',
        value: 'John',
        displayValue: 'John',
      },
      {
        id: '2',
        key: 'email',
        label: 'Email',
        type: 'email',
        operator: 'contains',
        value: 'test@example.com',
        displayValue: 'test@example.com',
      },
    ];

    render(
      <Wrapper>
        <CompositeFiltersInput
          filters={mockFilters}
          value={activeFilters}
          onChange={() => {}}
          maxFilters={2}
        />
      </Wrapper>
    );

    expect(screen.getByText(/maximum of 2 filters reached/i)).toBeInTheDocument();
  });

  it('filters available fields based on input', async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={() => {}} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    await user.type(input, 'name');

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const activeFilters: ActiveFilter[] = [
      {
        id: '1',
        key: 'name',
        label: 'Name',
        type: 'text',
        operator: 'contains',
        value: 'John',
        displayValue: 'John',
      },
    ];

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={activeFilters} onChange={handleChange} />
      </Wrapper>
    );

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={() => {}} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });
  });

  it('renders with custom className', () => {
    const { container } = render(
      <Wrapper>
        <CompositeFiltersInput
          filters={mockFilters}
          value={[]}
          onChange={() => {}}
          className="custom-class"
        />
      </Wrapper>
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('handles select type filter', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={handleChange} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Status'));

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Active'));

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      const callArgs = handleChange.mock.calls[0][0];
      expect(callArgs[0].key).toBe('status');
      expect(callArgs[0].value).toBe('active');
    });
  });

  it('handles number type filter', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Wrapper>
        <CompositeFiltersInput filters={mockFilters} value={[]} onChange={handleChange} />
      </Wrapper>
    );

    const input = screen.getByPlaceholderText(/filter by/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Age'));

    await waitFor(() => {
      const valueInput = screen.getByPlaceholderText(/enter/i);
      expect(valueInput).toBeInTheDocument();
    });

    const valueInput = screen.getByPlaceholderText(/enter/i);
    await user.type(valueInput, '25');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      const callArgs = handleChange.mock.calls[0][0];
      expect(callArgs[0].key).toBe('age');
      expect(callArgs[0].value).toBe('25');
    });
  });
});

