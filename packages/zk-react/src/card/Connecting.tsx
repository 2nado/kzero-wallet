// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import React from 'react';

import Button from '../components/Button.js';
import CircleLoading from '../components/CircleLoading.js';
import Divider from '../components/Divider.js';
import PoweredBy from '../components/PoweredBy.js';
import BackIcon from '../icons/Back.js';
import GoogleIcon from '../icons/Google.js';
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

function Connecting({ success, error, onBack }: { success: boolean; error: boolean; onBack: () => void }) {
  return (
    <Wrapper>
      <Button iconOnly onClick={onBack}>
        <BackIcon />
      </Button>

      <Content>
        <CircleLoading size={128} success={success} error={error}>
          <GoogleIcon style={{ width: '60%', height: '60%' }} />
        </CircleLoading>
        <h3>Connecting with Google...</h3>
      </Content>

      <Divider />

      <PoweredBy showAccount />
    </Wrapper>
  );
}

export default React.memo(Connecting);
