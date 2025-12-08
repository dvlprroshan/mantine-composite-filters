import type { Preview } from '@storybook/react-vite';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import React, { useEffect } from 'react';
import { addons } from 'storybook/preview-api';
import { MantineProvider, useMantineColorScheme, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  primaryColor: 'blue',
});

const channel = addons.getChannel();

function ThemeSync({ initialTheme }: { initialTheme: string }) {
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const handleGlobalsUpdate = (globals: { theme?: string }) => {
      const theme = globals.theme || 'light';
      setColorScheme(theme === 'dark' ? 'dark' : 'light');
    };

    // Set initial theme
    setColorScheme(initialTheme === 'dark' ? 'dark' : 'light');

    channel.on('updateGlobals', handleGlobalsUpdate);
    return () => channel.off('updateGlobals', handleGlobalsUpdate);
  }, [initialTheme, setColorScheme]);

  return null;
}

function StorybookWrapper({ children, initialTheme }: { children: React.ReactNode; initialTheme: string }) {
  return (
    <MantineProvider theme={theme}>
      <ThemeSync initialTheme={initialTheme} />
      <Notifications />
      {children}
    </MantineProvider>
  );
}

export const decorators = [
  (renderStory: any, context: any) => {
    const currentTheme = context.globals?.theme || 'light';
    return (
      <StorybookWrapper initialTheme={currentTheme}>
        {renderStory()}
      </StorybookWrapper>
    );
  },
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
