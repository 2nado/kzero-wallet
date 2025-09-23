// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { SignerResult } from '@kzero/zk-core';

import styled from '@emotion/styled';
import { useContext, useEffect, useRef, useState } from 'react';

import Button from '../components/Button.js';
import CircleLoading from '../components/CircleLoading.js';
import PoweredBy from '../components/PoweredBy.js';
import { ThemeContext } from '../context.js';
import { walletIframeUrl } from '../defaults.js';
import BackIcon from '../icons/Back.js';
import KzeroLogo from '../icons/KzeroLogo.js';
import { sendMessage } from '../sendMessage.js';
import SecurityCheck from './SecurityCheck.js';
import Wrapper from './Wrapper.js';

const IframeWrapper = styled.div({
  position: 'relative',
  width: '100%',
  height: 400,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

function SignExtrinsic({
  id,
  address,
  method,
  onSuccess,
  onError,
  onForget
}: {
  id: string;
  address: string;
  method: string;
  onSuccess: (result: SignerResult) => void;
  onError: (reason: string) => void;
  onForget: () => void;
}) {
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (iframeRef.current && ready) {
      sendMessage(iframeRef.current, 'theme.set', theme);
    }
  }, [theme, ready]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const originUrl = new URL(event.origin);
      const walletUrl = new URL(walletIframeUrl);

      if (originUrl.origin !== walletUrl.origin) return;

      if (event.data.type === 'wallet.ready') {
        setReady(true);

        if (iframeRef.current) {
          sendMessage(iframeRef.current, 'wallet.ready', null);
        }
      } else if (event.data.type === 'sign-error') {
        onError(event.data.reason);
      } else if (event.data.type === 'forget-passphrase') {
        onError(event.data.reason);
        onForget();
      } else if (event.data.type === 'sign-success') {
        onSuccess({
          id,
          signature: event.data.signature,
          signedTransaction: event.data.signedTransaction
        });
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, onError, onForget, onSuccess]);

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
        <Button
          iconOnly
          onClick={() => {
            onError('User rejected');
          }}
        >
          <BackIcon />
        </Button>
        <SecurityCheck />
      </div>

      <div>
        <IframeWrapper>
          <iframe
            src={`${walletIframeUrl}/sign-payload/${address}/${method}`}
            style={{ display: ready ? 'block' : 'none', width: '100%', height: '100%', border: 'none' }}
            ref={iframeRef}
            allow='clipboard-read; clipboard-write'
          />
          {!ready && (
            <CircleLoading size={128} success={ready}>
              <KzeroLogo style={{ width: '50%', height: '50%', color: 'inherit' }} />
            </CircleLoading>
          )}
        </IframeWrapper>
      </div>
      <PoweredBy showAccount />
    </Wrapper>
  );
}

export default SignExtrinsic;
