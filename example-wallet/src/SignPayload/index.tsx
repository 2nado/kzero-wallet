// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { Proof, ZkAccount } from '@kzero/zk-core';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import CallDisplay from './CallDisplay';
import Content from './Content';
import RequestInfo from './RequestInfo';
import Submit from './Submit';
import { getAccount, getProof } from './utils';

function SignPayloadContent({ address, method }: { address: string; method: string }) {
  const [api] = useState(() => new ApiPromise({ provider: new WsProvider('wss://node-template.kzero.xyz') }));
  const [ready, setReady] = useState(false);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    api.isReady.then(() => {
      setReady(true);
      setTimeout(() => {
        window.parent.postMessage({ type: 'wallet.ready' }, '*');
      }, 600);
    });
  }, [api]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'wallet.ready') {
        setOrigin(event.origin);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const [account] = useMemo((): [ZkAccount | null, Proof | null] => {
    const account = getAccount(address);

    const proof = account && account.type === 'zk' ? getProof(account.ephemeralPublicKey) : null;

    return [account, proof];
  }, [address]);

  const call = useMemo(() => {
    try {
      return ready ? api.registry.createType('Call', method) : null;
    } catch {
      return null;
    }
  }, [api.registry, method, ready]);

  const jsonDetails = useMemo(() => {
    return call ? call.toHuman() : null;
  }, [call]);

  return (
    <Content center={!ready}>
      {account && ready && (
        <>
          <RequestInfo
            origin={origin}
            account={account}
            chain={api.runtimeChain.toString()}
            hexDetails={method}
            jsonDetails={jsonDetails}
          />
          {ready && call ? <CallDisplay api={api} call={call} /> : null}
          <Submit api={api} method={method} address={address} />
        </>
      )}
    </Content>
  );
}

function SignPayload(): React.ReactNode {
  const { address, method } = useParams<'address' | 'method'>();

  if (!address || !method) return null;

  return <SignPayloadContent address={address} method={method} />;
}

export default SignPayload;
