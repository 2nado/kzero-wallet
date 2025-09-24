// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { ApiPromise } from '@polkadot/api';

import styled from '@emotion/styled';
import { createPair } from '@polkadot/keyring';
import { u8aToU8a } from '@polkadot/util';
import { blake2AsHex, blake2AsU8a, ed25519PairFromSecret, encodeAddress } from '@polkadot/util-crypto';
import { useState } from 'react';

import { Button, PinInput } from '@kzero/zk-react';
import { decrypt, unlock } from '@kzero/zk-wallet';

import HideIcon from '../icons/Hide';
import ViewIcon from '../icons/View';
import { prepareCall } from '../parseCall';
import { getAccount, getProof } from './utils';

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 20
});

const ButtonWrapper = styled.div<{ isHidden: boolean }>(({ isHidden }) => ({
  width: '100%',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  '> .Kzero_encrypt-button-icon': {
    flex: '0 0 auto',
    borderRadius: isHidden ? '20px' : undefined,
    color: isHidden ? 'var(--kzero-border-color)' : 'var(--kzero-primary-color)',
    borderColor: isHidden ? 'var(--kzero-border-color)' : 'var(--kzero-primary-color)',
    ':hover': {
      color: '#FFFFFF',
      borderColor: 'var(--kzero-primary-color)'
    }
  }
}));

function Submit({ api, method, address }: { api: ApiPromise; method: string; address: string }) {
  const [hasPassphrase] = useState(() => !!sessionStorage.getItem('passphrase'));
  const [isHidden, setIsHidden] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async (address: string, method: string) => {
    setIsLoading(true);

    try {
      const account = getAccount(address);

      if (!account || account.type !== 'zk') {
        throw new Error('Invalid account');
      }

      const proof = getProof(account.ephemeralPublicKey);

      if (!proof) {
        throw new Error('No proof found');
      }

      const ephemeralEncrypted = JSON.parse(
        localStorage.getItem(`ephemeral_keypair:${account.ephemeralPublicKey}`) || 'null'
      );

      if (!ephemeralEncrypted) {
        throw new Error('No ephemeral keypair found');
      }

      await api.isReady;

      const {
        uxt,
        zkMaterial,
        address: zkAddress
      } = await prepareCall(
        api,
        method,
        createPair(
          { toSS58: (address) => encodeAddress(address), type: 'ed25519' },
          ed25519PairFromSecret(
            decrypt(
              u8aToU8a(ephemeralEncrypted),
              blake2AsU8a(JSON.parse(sessionStorage.getItem('passphrase') || 'null'))
            )
          )
        ),
        proof
      );

      const tx = api.tx.zkLogin.submitZkloginUnsigned(
        api.createType('Bytes', uxt),
        api.createType('MultiAddress', {
          Id: zkAddress
        }),
        zkMaterial
      );

      window.parent.postMessage(
        { type: 'sign-success', signedTransaction: tx.toHex(), signature: tx.signature.toString() },
        '*'
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error';

      window.parent.postMessage({ type: 'sign-error', reason }, '*');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = () => {
    setIsError(false);
  };

  const onComplete = (value: string) => {
    try {
      unlock(blake2AsHex(value));
      handlePress(address, method);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  return (
    <Content>
      {!hasPassphrase ? (
        <PinInput isHidden={isHidden} isError={isError} onChange={handleChange} onComplete={onComplete} />
      ) : null}
      <ButtonWrapper isHidden={isHidden}>
        {!hasPassphrase && (
          <Button className='Kzero_encrypt-button-icon' onClick={() => setIsHidden(!isHidden)}>
            {isHidden ? <ViewIcon /> : <HideIcon />}
          </Button>
        )}
        <Button
          color='primary'
          onClick={() => window.parent.postMessage({ type: 'sign-error', reason: 'User rejected' }, '*')}
        >
          Reject
        </Button>
        {hasPassphrase ? (
          <Button
            disabled={isLoading}
            style={{ flex: '1' }}
            variant='filled'
            color='primary'
            onClick={() => handlePress(address, method)}
          >
            Submit
          </Button>
        ) : (
          <span
            style={{
              flex: '1',
              cursor: 'pointer',
              color: 'var(--kzero-primary-color)',
              fontSize: 14,
              textAlign: 'right'
            }}
            onClick={() => window.parent.postMessage({ type: 'forget-passphrase', reason: 'Forget passphrase' }, '*')}
          >
            Forget PIN?
          </span>
        )}
      </ButtonWrapper>
    </Content>
  );
}

export default Submit;
