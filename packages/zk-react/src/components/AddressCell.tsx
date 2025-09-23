// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { Account } from '@kzero/zk-core';

import styled from '@emotion/styled';
import { encodeAddress } from '@polkadot/util-crypto';
import { useMemo } from 'react';

import { useCopy } from '../hooks/useCopy.js';
import Copy from '../icons/Copy.js';
import GoogleIcon from '../icons/Google.js';
import Success from '../icons/Success.js';
import Avatar from './Avatar.js';

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  '& > :first-of-type': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'var(--kzero-success-color)'
  },
  '& > .Kzero_AddressCell_Address': {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--kzero-text-color)',
    lineHeight: 1.2,
    '& > b': {
      fontWeight: 600
    },
    '& > span': {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      fontWeight: 400,
      opacity: 0.5
    }
  }
});

function AddressCell({ iconSize = 40, account }: { iconSize?: number; account: Account }) {
  const address = useMemo(() => {
    const _address = encodeAddress(account.address);

    return _address.slice(0, 6) + '...' + _address.slice(-6);
  }, [account.address]);
  const { copy, isCopied } = useCopy();

  if (account.type === 'zk') {
    return (
      <Wrapper>
        <div />
        <Avatar
          width={iconSize}
          height={iconSize}
          src={account.picture}
          fallback={<GoogleIcon style={{ width: '60%', height: '60%' }} />}
        />
        <div className='Kzero_AddressCell_Address'>
          <b>{account.name}</b>
          <span onClick={() => copy(encodeAddress(account.address))}>
            {address}

            {isCopied ? (
              <Success style={{ width: 12, height: 12 }} />
            ) : (
              <Copy style={{ cursor: 'pointer', width: 12, height: 12 }} />
            )}
          </span>
        </div>
      </Wrapper>
    );
  }

  // TODO: injected account
  return <Wrapper>{account.address}</Wrapper>;
}

export default AddressCell;
