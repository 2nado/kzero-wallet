// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconOnly?: boolean;
  variant?: 'bordered' | 'filled';
  color?: 'primary' | 'success' | 'error' | 'default';
  disabled?: boolean;
  align?: 'left' | 'right' | 'center';
}

// eslint-disable-next-line react-refresh/only-export-components
export default styled.button<ButtonProps>(
  ({ iconOnly, disabled, variant = 'bordered', color = 'default', align = 'center' }) => {
    const background = disabled
      ? 'var(--kzero-button-disabled-background-color)'
      : variant === 'filled'
        ? color === 'primary'
          ? 'var(--kzero-primary-color)'
          : color === 'success'
            ? 'var(--kzero-success-color)'
            : color === 'error'
              ? 'var(--kzero-error-color)'
              : 'var(--kzero-border-color)'
        : 'transparent';
    const borderColor = disabled
      ? 'var(--kzero-button-disabled-background-color)'
      : variant === 'bordered'
        ? color === 'primary'
          ? 'var(--kzero-primary-color)'
          : color === 'success'
            ? 'var(--kzero-success-color)'
            : color === 'error'
              ? 'var(--kzero-error-color)'
              : undefined
        : background;
    const textColor = disabled
      ? 'var(--kzero-button-disabled-text-color)'
      : variant === 'filled'
        ? color === 'primary'
          ? 'var(--kzero-primary-contrast-color)'
          : color === 'success'
            ? 'var(--kzero-success-contrast-color)'
            : color === 'error'
              ? 'var(--kzero-error-contrast-color)'
              : 'inherit'
        : color === 'primary'
          ? 'var(--kzero-primary-color)'
          : color === 'success'
            ? 'var(--kzero-success-color)'
            : color === 'error'
              ? 'var(--kzero-error-color)'
              : 'inherit';

    const hoverBackground = disabled
      ? 'var(--kzero-button-disabled-background-color)'
      : variant === 'filled'
        ? undefined
        : color === 'primary'
          ? 'var(--kzero-primary-color)'
          : color === 'success'
            ? 'var(--kzero-success-color)'
            : color === 'error'
              ? 'var(--kzero-error-color)'
              : 'var(--kzero-primary-color)';
    const hoverText = disabled
      ? 'var(--kzero-button-disabled-text-color)'
      : variant === 'filled'
        ? undefined
        : color === 'primary'
          ? 'var(--kzero-primary-contrast-color)'
          : color === 'success'
            ? 'var(--kzero-success-contrast-color)'
            : color === 'error'
              ? 'var(--kzero-error-contrast-color)'
              : 'var(--kzero-primary-contrast-color)';
    const activeBackground = hoverBackground;
    const activeText = hoverText;

    return {
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: iconOnly ? 'min-content' : 'auto',
      height: 40,
      display: iconOnly ? 'inline-flex' : 'flex',
      alignItems: 'center',
      justifyContent: align,
      gap: 10,
      padding: iconOnly ? '4px' : '8px 15px',
      background: background,
      borderRadius: 'var(--kzero-radius-button)',
      border: iconOnly ? 'none' : '1px solid var(--kzero-border-color)',
      borderColor,
      color: textColor,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '0.16px',
      transition: 'all 0.2s ease',
      ':hover': {
        background: hoverBackground,
        color: hoverText,
        opacity: !disabled && variant === 'filled' ? 0.8 : undefined,
        borderColor: disabled ? 'var(--kzero-button-disabled-background-color)' : undefined,
        '.Kzero_google-svg-icon > path, .Kzero_discord-svg-icon > path, .Kzero_telegram-svg-icon > path': {
          color: hoverText,
          fill: 'currentColor'
        }
      },
      ':active': {
        background: activeBackground,
        color: activeText,
        transform: 'scale(0.96)',
        '.Kzero_google-svg-icon > path, .Kzero_discord-svg-icon > path, .Kzero_telegram-svg-icon > path': {
          color: activeText,
          fill: 'currentColor'
        }
      }
    };
  }
);
