// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ZkAccount } from '@kzero/zk-core';

import styled from '@emotion/styled';
import { encodeAddress } from '@polkadot/util-crypto';
import { useMemo, useState } from 'react';
import ReactJson from 'react-json-view';

import { Avatar } from '@kzero/zk-react';

import GoogleIcon from '../icons/Google';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  paddingTop: 20,
  paddingBottom: 20,
  '& > .RequestInfo-origin': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--kzero-secondary-color)',
    color: 'var(--kzero-secondary-contrast-color)',
    fontSize: 12,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 'var(--kzero-radius-button)',
    '& > span': {
      opacity: 0.5
    }
  },
  '& > h3': {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '24px',
    textAlign: 'center'
  },
  '& > p': {
    margin: 0,
    fontSize: 14,
    lineHeight: '17px',
    textAlign: 'center'
  },
  '& > .RequestInfo-account': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  },
  '& > .RequestInfo-view': {
    color: 'var(--kzero-primary-color)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

function RequestInfo({
  origin = 'Unknown',
  account,
  chain,
  hexDetails,
  jsonDetails
}: {
  origin?: string;
  account: ZkAccount;
  chain: string;
  hexDetails: string;
  jsonDetails: Record<string, any> | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const address = useMemo(() => {
    const _address = encodeAddress(account.address);

    return _address.slice(0, 6) + '...' + _address.slice(-6);
  }, [account.address]);

  return (
    <Wrapper>
      <div className='RequestInfo-origin'>
        <span>{origin}</span>
      </div>

      <h3>Approve Request</h3>
      <p>You are approving a request with account</p>

      <div className='RequestInfo-account'>
        <Avatar
          width={24}
          height={24}
          src={account.picture}
          fallback={<GoogleIcon style={{ width: '60%', height: '60%' }} />}
        />
        <b style={{ fontWeight: 600 }}>{account.name || address}</b>
        <span>On</span>
        <b style={{ fontWeight: 600 }}>{chain}</b>
      </div>

      {isOpen &&
        (jsonDetails ? (
          <ReactJson
            style={{ width: '100%', overflow: 'auto' }}
            enableClipboard={false}
            indentWidth={2}
            src={jsonDetails}
            displayDataTypes={false}
            displayObjectSize={false}
            collapseStringsAfterLength={15}
            theme='summerfruit:inverted'
          />
        ) : (
          <div style={{ wordBreak: 'break-all' }}>{hexDetails}</div>
        ))}

      <div className='RequestInfo-view' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Details' : 'View Details'}
      </div>
    </Wrapper>
  );
}

export default RequestInfo;
