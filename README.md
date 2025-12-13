# mantine-composite-filters

A powerful composite filters component for Mantine that allows users to build complex filter queries through an intuitive interface. It supports multiple filter types, operators, presets, history tracking, and extensive customization options.

[![npm version](https://img.shields.io/npm/v/mantine-composite-filters.svg)](https://www.npmjs.com/package/mantine-composite-filters)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Documentation

[View full documentation](https://dvlprroshan.github.io/mantine-composite-filters/)

## Installation

```bash
npm install mantine-composite-filters
# or
yarn add mantine-composite-filters
```

## Peer Dependencies

```bash
npm install @mantine/core @mantine/hooks @mantine/dates @mantine/notifications @tabler/icons-react dayjs
```

## Usage

```tsx
import { CompositeFiltersInput } from 'mantine-composite-filters';
import 'mantine-composite-filters/styles.css';

const filterFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  { key: 'createdAt', label: 'Created At', type: 'date' },
  { key: 'amount', label: 'Amount', type: 'number' },
];

function App() {
  const [filters, setFilters] = useState([]);

  return (
    <CompositeFiltersInput
      fields={filterFields}
      value={filters}
      onChange={setFilters}
    />
  );
}
```

## Features

- **Multiple Filter Types**: Text, number, select, multi-select, date, date range, and boolean filters
- **Rich Operators**: Comprehensive operators for each filter type (equals, contains, greater than, etc.)
- **Filter Presets**: Save and load filter configurations
- **History Tracking**: Navigate through filter history with undo/redo
- **Keyboard Shortcuts**: Power user keyboard navigation
- **Overflow Handling**: Multiple display modes for handling many active filters
- **Fully Customizable**: Extensive styling and behavior customization options
- **TypeScript Support**: Full TypeScript definitions included

## Local Development

```bash
# Install dependencies
yarn

# Start development server
npm run dev

# Run storybook
npm run storybook

# Build package
npm run build

# Run tests
npm test
```

## License

MIT
