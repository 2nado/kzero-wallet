// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import React from 'react';

import Button from '../components/Button.js';
import Divider from '../components/Divider.js';
import PoweredBy from '../components/PoweredBy.js';
import BackIcon from '../icons/Back.js';
import Failed from '../icons/Failed.js';
import Wrapper from './Wrapper.js';

const Content = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  '> h3': {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '24px'
  }
});

function LoginFailed({ reason, onBack }: { reason: string; onBack: () => void }) {
  return (
    <Wrapper>
      <Button iconOnly onClick={onBack}>
        <BackIcon />
      </Button>

      <Content>
        <Failed style={{ width: 128, height: 128 }} />
        <h3>{reason}</h3>
      </Content>

      <Divider />

      <PoweredBy showAccount />
    </Wrapper>
  );
}

export default React.memo(LoginFailed);
