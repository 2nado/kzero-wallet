// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { alpha, emphasize, lighten, StyledEngineProvider } from '@mui/material';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { LoginProvider } from '@kzero/zk-core';
import { WalletProvider } from '@kzero/zk-react';
import { darkTheme, lightTheme } from '@kzero/zk-react/defaults';

import BaseContainer from './BaseContainer';
import Center from './Center';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import Left from './Left';
import ThemeProvider from './theme';
import { getBestForegroundColor } from './utils';

function App() {
  const [theme, setTheme] = useState('light');
  const [color, setColor] = useState('#FDFCFC');
  const [primaryColor, setPrimaryColor] = useState(lightTheme.colors.primaryColor);
  const [providers] = useState<LoginProvider[]>(['google', 'apple', 'github']);
  const [selectedProviders, setSelectedProviders] = useState<LoginProvider[]>(providers);
  const [brand, setBrand] = useState<string>('');
  const [radius, setRadius] = useState<'small' | 'medium' | 'large'>('medium');

  const primaryColors = {
    primaryColor: primaryColor,
    primaryContrastColor: getBestForegroundColor(primaryColor),
    secondaryColor: alpha(primaryColor, 0.1),
    secondaryContrastColor: primaryColor,
    dividerColor: alpha(getBestForegroundColor(primaryColor), 0.1)
  };

  const radiusTheme = {
    card: radius === 'small' ? '10px' : radius === 'medium' ? '30px' : '50px',
    button: radius === 'small' ? '5px' : radius === 'medium' ? '10px' : '30px'
  };

  const themes =
    theme === 'light'
      ? { ...lightTheme, colors: { ...lightTheme.colors, ...primaryColors }, radius: radiusTheme }
      : { ...darkTheme, colors: { ...darkTheme.colors, ...primaryColors }, radius: radiusTheme };

  const customTheme = {
    ...themes,
    radius: radiusTheme,
    colors: {
      ...themes.colors,
      background: color,
      text: getBestForegroundColor(color),
      borderColor: lighten(emphasize(color, 0.2), 0.2),
      ...primaryColors
    }
  };

  const _themes = theme === 'custom' ? customTheme : themes;

  const workspaceColor = lighten(emphasize(_themes.colors.background, 0.02), 0.1);

  return (
    <StyledEngineProvider injectFirst>
      <WalletProvider
        providers={selectedProviders}
        theme={{
          ..._themes,
          customHeader: brand || '/kzero-bg.webp'
        }}
      >
        <ThemeProvider walletTheme={_themes}>
          <GlobalStyle />
          <Header workspaceColor={workspaceColor} />

          <BaseContainer
            workspaceColor={workspaceColor}
            walletTheme={_themes}
            left={
              <Left
                theme={_themes}
                providers={providers}
                selectedProviders={selectedProviders}
                brand={brand}
                radius={radius}
                setTheme={setTheme}
                setPrimaryColor={setPrimaryColor}
                setSelectedProviders={setSelectedProviders}
                setBrand={setBrand}
                setColor={setColor}
                setRadius={setRadius}
              />
            }
          >
            <Center />
          </BaseContainer>
          <ToastContainer />
        </ThemeProvider>
      </WalletProvider>
    </StyledEngineProvider>
  );
}

export default App;
