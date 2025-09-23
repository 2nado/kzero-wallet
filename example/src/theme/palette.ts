// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WalletTheme } from '@kzero/zk-react';

import { alpha, type PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    border: string;
  }
  interface PaletteOptions {
    border: string;
  }
}

/**
 * Customized Material UI color palette.
 *
 * @see https://mui.com/customization/palette/
 * @see https://mui.com/customization/default-theme/?expand-path=$.palette
 */
const createPalette = (walletTheme: WalletTheme): PaletteOptions => ({
  primary: {
    main: walletTheme.colors.primaryColor,
    light: walletTheme.colors.primaryColor,
    dark: walletTheme.colors.primaryColor,
    contrastText: walletTheme.colors.primaryContrastColor
  },
  success: {
    main: walletTheme.colors.successColor,
    light: walletTheme.colors.successColor,
    dark: walletTheme.colors.successColor,
    contrastText: walletTheme.colors.successContrastColor
  },
  error: {
    main: walletTheme.colors.errorColor,
    light: walletTheme.colors.errorColor,
    dark: walletTheme.colors.errorColor,
    contrastText: walletTheme.colors.errorContrastColor
  },
  warning: {
    main: walletTheme.colors.warningColor,
    light: walletTheme.colors.warningColor,
    dark: walletTheme.colors.warningColor,
    contrastText: walletTheme.colors.warningContrastColor
  },
  background: { default: walletTheme.colors.background, paper: walletTheme.colors.background },
  common: { black: '#000000', white: '#FDFCFC' },
  secondary: {
    main: walletTheme.colors.secondaryColor,
    light: walletTheme.colors.secondaryColor,
    dark: walletTheme.colors.secondaryColor,
    contrastText: walletTheme.colors.secondaryContrastColor
  },
  text: {
    primary: walletTheme.colors.text,
    secondary: alpha(walletTheme.colors.text, 0.5),
    disabled: alpha(walletTheme.colors.text, 0.38)
  },
  border: walletTheme.colors.borderColor,
  divider: walletTheme.colors.dividerColor,
  action: {
    active: walletTheme.colors.dividerColor,
    activatedOpacity: 0.05,
    hover: walletTheme.colors.secondaryColor,
    hoverOpacity: 0.05,
    selected: walletTheme.colors.secondaryColor,
    selectedOpacity: 0.05,
    disabled: alpha(walletTheme.colors.text, 0.26),
    disabledBackground: alpha(walletTheme.colors.text, 0.12),
    disabledOpacity: 0.38,
    focus: walletTheme.colors.dividerColor,
    focusOpacity: 0.12
  }
});

export { createPalette };
