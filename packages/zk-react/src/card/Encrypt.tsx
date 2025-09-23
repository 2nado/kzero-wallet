// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { LoginProvider } from '@kzero/zk-core';

import styled from '@emotion/styled';
import React, { useContext, useState } from 'react';

import Button from '../components/Button.js';
import Divider from '../components/Divider.js';
import PinInput from '../components/PinInput.js';
import PoweredBy from '../components/PoweredBy.js';
import { WalletContext } from '../context.js';
import BackIcon from '../icons/Back.js';
import HideIcon from '../icons/Hide.js';
import ViewIcon from '../icons/View.js';
import SecurityCheck from './SecurityCheck.js';
import Wrapper from './Wrapper.js';

const Content = styled.form({
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
  },
  '& > .Kzero_pin-wrapper': {
    width: '100%'
  }
});

const ButtonWrapper = styled.div<{ isHidden: boolean }>(({ isHidden }) => ({
  width: '100%',
  height: 40,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  '> .Kzero_encrypt-button-icon': {
    flex: '0 0 auto',
    color: isHidden ? 'var(--kzero-border-color)' : 'var(--kzero-primary-color)',
    borderColor: isHidden ? 'var(--kzero-border-color)' : 'var(--kzero-primary-color)',
    ':hover': {
      color: '#FFFFFF',
      borderColor: 'var(--kzero-primary-color)'
    }
  },
  '> .Kzero_encrypt-button-confirm': {
    flex: '1 1 auto'
  }
}));

function Encrypt({
  isUnlock,
  provider,
  onConfirm,
  onBack,
  onForget
}: {
  isUnlock: boolean;
  provider: LoginProvider;
  onConfirm: (passphrase: string, provider: LoginProvider) => void;
  onBack: () => void;
  onForget: () => void;
}) {
  const { unlock } = useContext(WalletContext);

  const [passphrase, setPassphrase] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleChange = (value: string) => {
    setPassphrase(value);
    setIsError(false);
  };

  const onComplete = (value: string) => {
    if (isUnlock) {
      unlock(value)
        .then(() => {
          onConfirm(value, provider);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  };

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
        <Button iconOnly onClick={onBack}>
          <BackIcon />
        </Button>
        <SecurityCheck />
      </div>

      <Content
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h4>{isUnlock ? 'Verify' : 'Create Transaction PIN'}</h4>
        <p>{isUnlock ? 'Input your 6 digit transaction pin' : 'Required when initiating a transaction'}</p>

        <PinInput isHidden={isHidden} isError={isError} onChange={handleChange} onComplete={onComplete} />

        <ButtonWrapper isHidden={isHidden}>
          <Button type='button' className='Kzero_encrypt-button-icon' onClick={() => setIsHidden(!isHidden)}>
            {isHidden ? <ViewIcon /> : <HideIcon />}
          </Button>
          {isUnlock ? (
            <span onClick={onForget} style={{ cursor: 'pointer', color: 'var(--kzero-primary-color)' }}>
              Forget PIN?
            </span>
          ) : (
            <Button
              type='submit'
              variant='filled'
              color='primary'
              disabled={passphrase.length !== 6}
              className='Kzero_encrypt-button-confirm'
              onClick={() => onConfirm(passphrase, provider)}
            >
              Confirm
            </Button>
          )}
        </ButtonWrapper>
      </Content>

      <Divider />

      <PoweredBy showAccount />
    </Wrapper>
  );
}

export default React.memo(Encrypt);
