// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { Hex, LoginProvider, SignerResult } from '@kzero/zk-core';

import { useCallback, useContext, useEffect, useState } from 'react';

import { WalletContext } from '../context.js';
import Connecting from './Connecting.js';
import Encrypt from './Encrypt.js';
import Forget from './Forget.js';
import LoginFailed from './LoginFailed.js';
import LoginSuccess from './LoginSuccess.js';
import SignExtrinsic from './SignExtrinsic.js';
import Welcome from './Welcome.js';

export type ConnectingType =
  | { status: 'idle' }
  | (({ status: 'pending' } | { status: 'completed'; isSuccess: boolean }) &
      ({ type: 'zk'; provider: LoginProvider } | { type: 'injected'; source: string }))
  | ({ status: 'failed' } & { reason: string })
  | { status: 'encrypting' }
  | { status: 'unlocking' }
  | { status: 'ready' };

function WalletCard({
  onLogin,
  onSignSuccess,
  onSignError
}: {
  onLogin?: () => void;
  onSignSuccess?: (result: SignerResult) => void;
  onSignError?: (error: string) => void;
}) {
  const { connect, accounts, encrypt, update, unlock, signOpen } = useContext(WalletContext);
  const [provider, setProvider] = useState<LoginProvider | null>(null);
  const [connecting, setConnecting] = useState<ConnectingType>({
    status: 'idle'
  });
  const [ephemeralPublicKey, setEphemeralPublicKey] = useState<Hex | null>(null);
  const [forget, setForget] = useState<boolean>(false);

  const handleProviderClick = useCallback(
    async (provider: LoginProvider) => {
      setForget(false);
      setProvider(provider);

      setConnecting({ status: 'pending', type: 'zk', provider: provider as LoginProvider });

      try {
        const ephemeralPublicKey = await connect('zk', provider);

        setEphemeralPublicKey(ephemeralPublicKey);

        setConnecting({ status: 'completed', isSuccess: true, type: 'zk', provider: provider as LoginProvider });

        setTimeout(() => {
          setConnecting({ status: 'encrypting' });
        }, 600);
      } catch (error) {
        setConnecting({ status: 'completed', isSuccess: false, type: 'zk', provider: provider as LoginProvider });

        setTimeout(() => {
          setConnecting({ status: 'failed', reason: (error as any)?.toString?.() || 'Failed to connect' });
        }, 600);
      }
    },
    [connect]
  );

  const onConfirm = useCallback(
    async (passphrase: string) => {
      if (ephemeralPublicKey) {
        try {
          await encrypt(ephemeralPublicKey, passphrase);
          setConnecting({ status: 'ready' });
          update();
          onLogin?.();
        } catch (error) {
          setConnecting({ status: 'failed', reason: (error as any)?.toString?.() || 'Failed to encrypt' });
        }
      }
    },
    [encrypt, ephemeralPublicKey, onLogin, update]
  );

  const onUnlock = useCallback(
    async (passphrase: string) => {
      await unlock(passphrase);

      try {
        setConnecting({ status: 'pending', type: 'zk', provider: provider as LoginProvider });

        await connect('zk', provider as LoginProvider);

        setConnecting({ status: 'completed', isSuccess: true, type: 'zk', provider: provider as LoginProvider });
        update();

        setTimeout(() => {
          setConnecting({ status: 'ready' });
          onLogin?.();
        }, 600);
      } catch (error) {
        setConnecting({ status: 'completed', isSuccess: false, type: 'zk', provider: provider as LoginProvider });

        setTimeout(() => {
          setConnecting({ status: 'failed', reason: (error as any)?.toString?.() || 'Failed to connect' });
        }, 600);
      }
    },
    [connect, provider, onLogin, unlock, update]
  );

  useEffect(() => {
    if (accounts.length > 0 && accounts[0].status === 'ready' && accounts[0].proofStatus === 'generated') {
      setConnecting({ status: 'ready' });
    }
  }, [accounts]);

  if (forget) {
    return <Forget onConfirm={handleProviderClick} onBack={() => setForget(false)} />;
  }

  if (provider && accounts.length > 0 && (connecting.status === 'encrypting' || connecting.status === 'unlocking')) {
    return (
      <Encrypt
        isUnlock={connecting.status === 'unlocking'}
        provider={provider}
        onConfirm={connecting.status === 'encrypting' ? onConfirm : onUnlock}
        onBack={() =>
          connecting.status === 'unlocking'
            ? setConnecting({ status: 'idle' })
            : setConnecting((value) => (value.status === connecting.status ? value : { status: 'idle' }))
        }
        onForget={() => setForget(true)}
      />
    );
  }

  if (connecting.status === 'failed') {
    return <LoginFailed reason={connecting.reason} onBack={() => setConnecting({ status: 'idle' })} />;
  }

  if (signOpen.signOpen) {
    return (
      <SignExtrinsic
        id={signOpen.id}
        address={signOpen.address}
        method={signOpen.method}
        onSuccess={(result: SignerResult) => {
          onSignSuccess?.(result);
          signOpen.callback(result);
        }}
        onError={(error) => {
          signOpen.onError(error);
          onSignError?.(error);
        }}
        onForget={() => setForget(true)}
      />
    );
  }

  if (accounts.length > 0 && connecting.status === 'ready') {
    return <LoginSuccess />;
  }

  if (connecting.status === 'pending' || connecting.status === 'completed') {
    return (
      <Connecting
        success={connecting.status === 'completed' && connecting.isSuccess}
        error={connecting.status === 'completed' && !connecting.isSuccess}
        onBack={() => setConnecting((value) => (value.status === 'pending' ? value : { status: 'idle' }))}
      />
    );
  }

  return <Welcome handleProviderClick={handleProviderClick} />;
}

export default WalletCard;
