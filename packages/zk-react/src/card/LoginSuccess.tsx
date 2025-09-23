// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import styled from '@emotion/styled';
import React from 'react';

import Divider from '../components/Divider.js';
import PoweredBy from '../components/PoweredBy.js';
import SuccessLogin from '../icons/SuccessLogin.js';
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

function LoginSuccess() {
  return (
    <Wrapper>
      <Content>
        <SuccessLogin style={{ width: 128, height: 128 }} />
        <h3>Login successfully</h3>
      </Content>

      <Divider />

      <PoweredBy showAccount />
    </Wrapper>
  );
}

export default React.memo(LoginSuccess);
