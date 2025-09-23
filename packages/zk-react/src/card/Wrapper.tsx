// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';

// eslint-disable-next-line react-refresh/only-export-components
export default styled.div({
  flexShrink: 0,
  boxSizing: 'border-box',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  fontFamily: 'Poppins, "Sofia Sans Semi Condensed", sans-serif',
  width: 320,
  maxWidth: '100%',
  minHeight: 420,
  padding: 20,
  border: '1px solid var(--kzero-divider-color)',
  color: 'var(--kzero-text-color)',
  fontSize: '14px',
  background: 'var(--kzero-background-color)',
  borderRadius: 'var(--kzero-radius-card)',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  '& *': {
    boxSizing: 'border-box'
  },
  '@media (max-width: 600px)': {
    width: '100%',
    paddingBottom: 20,
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px'
  }
});
