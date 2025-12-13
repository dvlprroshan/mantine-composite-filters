import type { MantineDemo } from '@mantinex/demo';
import { Configurator } from './Configurator';
import { Usage } from './Usage';
import { AllFilterTypes } from './AllFilterTypes';
import { WithMaxFilters } from './WithMaxFilters';
import { OverflowModes } from './OverflowModes';
import { WithPresets } from './WithPresets';
import { CustomStyling } from './CustomStyling';
import { CustomPills } from './CustomPills';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { SimpleDataTableDemo } from './SimpleDataTableDemo';
import { StylesApiDemo } from './StylesApiDemo';
import { CompositeFiltersInputStylesApi } from '../styles-api/CompositeFiltersInput.styles-api';

export const usage: MantineDemo = {
  type: 'code',
  component: Usage,
  code: '',
};

export const configurator: MantineDemo = {
  type: 'code',
  component: Configurator,
  code: '',
};

export const allFilterTypes: MantineDemo = {
  type: 'code',
  component: AllFilterTypes,
  code: '',
};

export const withMaxFilters: MantineDemo = {
  type: 'code',
  component: WithMaxFilters,
  code: '',
};

export const overflowModes: MantineDemo = {
  type: 'code',
  component: OverflowModes,
  code: '',
};

export const withPresets: MantineDemo = {
  type: 'code',
  component: WithPresets,
  code: '',
};

export const customStyling: MantineDemo = {
  type: 'code',
  component: CustomStyling,
  code: '',
};

export const customPills: MantineDemo = {
  type: 'code',
  component: CustomPills,
  code: '',
};

export const keyboardShortcuts: MantineDemo = {
  type: 'code',
  component: KeyboardShortcuts,
  code: '',
};

export const simpleDataTable: MantineDemo = {
  type: 'code',
  component: SimpleDataTableDemo,
  code: '',
};

const stylesApiCode = `
import { CompositeFiltersInput } from 'mantine-composite-filters';

function Demo() {
  const [filters, setFilters] = useState([]);

  return (
    <CompositeFiltersInput{{props}}
      filters={sampleFilters}
      value={filters}
      onChange={setFilters}
      placeholder="Filter items..."
    />
  );
}
`;

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: CompositeFiltersInputStylesApi,
  component: StylesApiDemo,
  code: stylesApiCode,
  centered: true,
  maxWidth: 500,
};
