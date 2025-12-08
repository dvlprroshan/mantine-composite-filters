import React from 'react';
import cx from 'clsx';
import { AppShell, Container, Group, RemoveScroll, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ColorSchemeControl, HeaderControls } from '@mantinex/mantine-header';
import { MantineLogo } from '@mantinex/mantine-logo';
import { meta } from '@mantinex/mantine-meta';
import { PACKAGE_DATA } from '../../data';
import classes from './Shell.module.css';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { toggleColorScheme } = useMantineColorScheme();
  useHotkeys([['mod + J', toggleColorScheme]]);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header className={cx(RemoveScroll.classNames.zeroRight, classes.header)}>
        <Container size="lg" px="md" className={classes.inner}>
          <a
            href="https://github.com/dvlprroshan/mantine-composite-filters"
            target="_blank"
            className={cx(classes.logo, 'mantine-focus-auto')}
            rel="noreferrer"
            aria-label="Mantine Composite Filters - GitHub"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(90deg, #228be6 0%, #4dabf7 100%)',
                borderRadius: '.8rem',
                width: 36,
                borderTopLeftRadius:"0",
                borderBottomRightRadius:"0",
                height: 36,
                color: '#fff',
                fontWeight: 700,
                fontSize: 20,
                boxShadow: '0 2px 8px rgba(34, 139, 230, 0.15)'
              }}
            >
              <svg width="22" height="22" fill="none" aria-hidden="true" focusable="false" viewBox="0 0 22 22">
                <rect x="1.5" y="1.5" width="19" height="19" rx="5" stroke="#fff" strokeWidth="2.5" />
                <path d="M7.5 11H14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M11 7.5V14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.5px', color: 'var(--mantine-color-text)' }}>
              Mantine&nbsp;
              <span style={{
                background: 'linear-gradient(90deg, #228be6 0%, #4dabf7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Composite Filters
              </span>
            </span>
          </a>


          <HeaderControls
            visibleFrom="sm"
            githubLink={PACKAGE_DATA.repositoryUrl}
            withDirectionToggle={false}
            withSearch={false}
            withSupport={false}
            discordLink={meta.discordLink}
          />

          <Group hiddenFrom="sm">
            <ColorSchemeControl />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <div className={classes.main}>{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
