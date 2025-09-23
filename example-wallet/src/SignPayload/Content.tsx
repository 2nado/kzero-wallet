// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';

// eslint-disable-next-line react-refresh/only-export-components
export default styled.div<{ center?: boolean }>(({ center }) => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  overflowX: 'hidden',
  justifyContent: center ? 'center' : 'flex-start',
  alignItems: center ? 'center' : 'stretch',
  color: 'var(--kzero-text-color)',
  paddingLeft: 2,
  paddingRight: 2
}));
