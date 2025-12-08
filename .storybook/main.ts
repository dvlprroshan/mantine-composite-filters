// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../package/src/**/*.story.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    // Controls and Actions are included by default in Storybook 7+
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  viteFinal: async (config) => {
    // Ensure proper module resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  }
};

export default config;
