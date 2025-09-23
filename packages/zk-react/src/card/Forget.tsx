// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import styled from '@emotion/styled';
import React, { useContext } from 'react';

import AddressCell from '../components/AddressCell.js';
import Button from '../components/Button.js';
import { WalletContext } from '../context.js';
import BackIcon from '../icons/Back.js';
import Wrapper from './Wrapper.js';

const Content = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  '> h4': {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '24px'
  },
  '> p': {
    margin: 0,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '17px'
  }
});

const AccountWrapper = styled.div({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginTop: 20,
  padding: 15,
  border: `1px solid var(--kzero-border-color)`,
  borderRadius: 10,
  transition: 'all 0.2s ease',
  '&:hover,&:active': {
    borderColor: 'var(--kzero-primary-color)'
  },
  '&:active': {
    transform: 'scale(0.98)'
  }
});

function Forget({ onConfirm, onBack }: { onConfirm: (provider: LoginProvider) => void; onBack: () => void }) {
  const { accounts } = useContext(WalletContext);

  return (
    <Wrapper>
      <Button iconOnly onClick={onBack}>
        <BackIcon />
      </Button>

      <Content>
        <h4>Set New Transaction PIN</h4>
        <p>Verify your account</p>

        {accounts.map((account) => (
          <AccountWrapper key={account.address} onClick={() => onConfirm(account.provider)}>
            <AddressCell account={account} />
          </AccountWrapper>
        ))}
      </Content>
    </Wrapper>
  );
}

export default React.memo(Forget);
