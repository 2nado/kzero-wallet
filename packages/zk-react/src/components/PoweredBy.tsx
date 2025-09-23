// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import styled from '@emotion/styled';
import { useContext } from 'react';

import { WalletContext } from '../context.js';
import KzeroText from '../icons/KzeroText.js';
import AddressCell from './AddressCell.js';

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  fontSize: 12,
  lineHeight: '14px',
  '&>img': {
    height: '10px'
  }
});

function PoweredBy({ showAccount = false }: { showAccount?: boolean }) {
  const { accounts } = useContext(WalletContext);

  if (showAccount && accounts.length > 0) {
    return <AddressCell account={accounts[0]} />;
  }

  return (
    <Wrapper>
      <span style={{ opacity: 0.3 }}>Powered by</span>
      <KzeroText style={{ width: 75, height: 10, color: 'inherit', opacity: 0.3 }} />
    </Wrapper>
  );
}

export default PoweredBy;
