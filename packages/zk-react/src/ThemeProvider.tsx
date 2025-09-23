// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WalletTheme } from './types.js';

import { css, Global } from '@emotion/react';
import { useEffect, useState } from 'react';

import { ThemeContext } from './context.js';
import { lightTheme } from './defaults.js';

function toPx(value: string | number) {
  return `${parseFloat(value.toString())}px`;
}

function ThemeProvider({
  children,
  theme: propsTheme = lightTheme
}: {
  children: React.ReactNode;
  theme?: WalletTheme;
}) {
  const [theme, setTheme] = useState(propsTheme);
  const globalStyles = css`
:root {
  --kzero-background-color: ${theme.colors.background};
  --kzero-text-color: ${theme.colors.text};
  --kzero-primary-color: ${theme.colors.primaryColor};
  --kzero-primary-contrast-color: ${theme.colors.primaryContrastColor};
  --kzero-secondary-color: ${theme.colors.secondaryColor};
  --kzero-secondary-contrast-color: ${theme.colors.secondaryContrastColor};
  --kzero-success-color: ${theme.colors.successColor};
  --kzero-success-contrast-color: ${theme.colors.successContrastColor};
  --kzero-error-color: ${theme.colors.errorColor};
  --kzero-error-contrast-color: ${theme.colors.errorContrastColor};
  --kzero-warning-color: ${theme.colors.warningColor};
  --kzero-warning-contrast-color: ${theme.colors.warningContrastColor};
  --kzero-border-color: ${theme.colors.borderColor};
  --kzero-divider-color: ${theme.colors.dividerColor};
  --kzero-radius-card: ${toPx(theme.radius.card)};
  --kzero-radius-button: ${toPx(theme.radius.button)};
  --kzero-button-disabled-background-color: ${theme.button.disabledBackgroundColor};
  --kzero-button-disabled-text-color: ${theme.button.disabledTextColor};
}
`;

  useEffect(() => {
    setTheme(propsTheme);
  }, [propsTheme]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'theme.set') {
        setTheme(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <Global styles={globalStyles} />
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
