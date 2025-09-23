// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './style.css';

import type {
  Hex,
  InjectedAccount,
  LoginProvider,
  MetadataDef,
  SignerPayloadJSON,
  SignerResult,
  ZkAccount
} from '@kzero/zk-core';
import type { WalletTheme } from './types.js';

import { blake2AsHex } from '@polkadot/util-crypto';
import { useCallback, useEffect, useState } from 'react';

import { INJECTED_PROVIDER_NAME } from '@kzero/zk-core/constants';

import { injectExtension } from './inject/index.js';
import PostMessageProvider from './inject/PostMessageProvider.js';
import { WalletContext } from './context.js';
import { defaultProviders, defaultTheme, walletIframeUrl } from './defaults.js';
import { sendMessage } from './sendMessage.js';
import ThemeProvider from './ThemeProvider.js';

interface ConnectFn {
  (type: 'zk', provider: LoginProvider): Promise<Hex>;
  (type: 'injected', source: string): Promise<void>;
  (type: 'zk' | 'injected', sourceOrProvider: string | LoginProvider): Promise<Hex | void>;
}

let iframeResolve: (iframe: HTMLIFrameElement) => void;
const iframePromise = new Promise((resolve) => {
  iframeResolve = resolve;
});

function createHiddenIframe(src: string, onLoad: () => void): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.style.display = 'none'; // Hide the iframe
  iframe.src = src; // Set the source of the iframe
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
  document.body.appendChild(iframe); // Append the iframe to the body

  const handleMessage = (event: MessageEvent) => {
    const originUrl = new URL(event.origin);
    const walletUrl = new URL(walletIframeUrl);

    if (originUrl.origin !== walletUrl.origin) return;

    if (event.data.type === 'wallet.ready') {
      window.removeEventListener('message', handleMessage);
      onLoad();
    }
  };

  window.addEventListener('message', handleMessage);

  iframeResolve(iframe);

  return iframe; // Return the created iframe
}

async function loginWithProvider(provider: LoginProvider, ephemeralPublicKey: Hex) {
  const url = new URL(walletIframeUrl);

  url.pathname = `/auth/${provider}/${ephemeralPublicKey}`;

  const newWindow = window.open(
    url,
    '_blank',
    `width=320,height=600,left=${window.screenX + (window.outerWidth - 320) / 2},top=${window.screenY + (window.outerHeight - 600) / 2}`
  );

  return new Promise<ZkAccount>((resolve, reject) => {
    const interval = setInterval(() => {
      if (newWindow?.closed) {
        clearInterval(interval);
        sendMessage(iframe, 'accounts.retrieve', { ephemeralPublicKey })
          .then((data) => {
            resolve(data.account);
          })
          .catch((error) => {
            console.error(error);
            reject('User rejected');
          });
      }
    }, 100);
  });
}

let iframe: HTMLIFrameElement;

const accountSubscribe = new Set<(accounts: InjectedAccount[]) => void>();

let openSign: (
  id: string,
  address: string,
  method: string,
  cb: (result: SignerResult) => void,
  onError: (reason: string) => void
) => void = () => {};

let signId = 0;

// inject the extension
injectExtension(
  async () => {
    // wait for the iframe to load
    await iframePromise;

    return {
      accounts: {
        get: (): Promise<InjectedAccount[]> =>
          sendMessage(iframe, 'accounts.all', null).then(({ accounts }) =>
            accounts.map((account) => ({
              address: account.address,
              name: account.name,
              type: 'ed25519'
            }))
          ),
        subscribe: (cb: (accounts: InjectedAccount[]) => void) => {
          const copiedCb = (accounts: InjectedAccount[]) => cb(accounts);

          accountSubscribe.add(copiedCb);

          return () => {
            accountSubscribe.delete(copiedCb);
          };
        }
      },
      metadata: {
        get: () => sendMessage(iframe, 'metadata.list', null),
        provide: (definition: MetadataDef) => sendMessage(iframe, 'metadata.provide', definition)
      },
      provider: new PostMessageProvider(),
      signer: {
        signPayload: (payload: SignerPayloadJSON): Promise<SignerResult> => {
          return new Promise((resolve, reject) => {
            openSign(`${signId++}.${Date.now()}`, payload.address, payload.method, resolve, (reason) => {
              console.error(reason);
              reject(new Error(reason));
            });
          });
        },
        signRaw: () => {
          throw new Error('Not implemented');
        }
      }
    };
  },
  // TODO: This should be the version of the extension
  { name: INJECTED_PROVIDER_NAME, version: '0.0.0' }
);

function WalletProvider({
  children,
  theme,
  providers = defaultProviders,
  enableWebWallet = true,
  enableAuthenticator = true
}: {
  enableWebWallet?: boolean;
  enableAuthenticator?: boolean;
  children: React.ReactNode;
  theme?: WalletTheme;
  providers?: LoginProvider[];
}) {
  const [accounts, setAccounts] = useState<ZkAccount[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [signOpen, setSignOpen] = useState<
    | {
        signOpen: true;
        id: string;
        method: string;
        address: string;
        callback: (result: SignerResult) => void;
        onError: (reason: string) => void;
      }
    | { signOpen: false }
  >({
    signOpen: false
  });

  openSign = (
    id: string,
    address: string,
    method: string,
    callback: (result: SignerResult) => void,
    onError: (reason: string) => void
  ) => {
    setSignOpen({
      signOpen: true,
      id,
      address,
      method,
      callback: (result) => {
        callback(result);
        setSignOpen({ signOpen: false });
      },
      onError: (reason) => {
        onError(reason);
        setSignOpen({ signOpen: false });
      }
    });
  };

  useEffect(() => {
    iframe = createHiddenIframe(walletIframeUrl, () => {
      setIsReady(true);

      sendMessage(iframe, 'accounts.all', null).then(({ accounts }) => {
        setAccounts(accounts);
      });

      sendMessage(iframe, 'isLocked', null).then(({ isLocked }) => {
        setIsLocked(isLocked);
      });

      window.addEventListener('message', (event) => {
        if (event.source === iframe.contentWindow) {
          if (event.data.type === 'accounts.change') {
            sendMessage(iframe, 'accounts.all', null).then(({ accounts }) => {
              setAccounts(accounts);
            });
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    accountSubscribe.forEach((cb) =>
      cb(
        accounts.map((account) => ({
          address: account.address,
          name: account.name,
          type: 'ed25519'
        }))
      )
    );
  }, [accounts]);

  const connect = useCallback(
    async (type: 'zk' | 'injected', sourceOrProvider: string | LoginProvider): Promise<Hex | void> => {
      if (type === 'zk') {
        const { publicKey } = await sendMessage(iframe, 'ephemeral-key.generate', null);

        const account = await loginWithProvider(sourceOrProvider as LoginProvider, publicKey);

        return account.ephemeralPublicKey;
      } else {
        throw new Error('Injected accounts are not supported');
      }
    },
    []
  );

  const getProof = useCallback(async (ephemeralPublicKey: Hex) => {
    const { proof } = await sendMessage(iframe, 'proof.get', { ephemeralPublicKey });

    return proof;
  }, []);

  const encrypt = useCallback(async (ephemeralPublicKey: Hex, passphrase?: string) => {
    await sendMessage(iframe, 'ephemeral-key.encrypt', {
      passphrase: passphrase ? blake2AsHex(passphrase) : undefined,
      ephemeralPublicKey
    });
    setIsLocked(false);
  }, []);

  const disconnect = useCallback((providerOrSource: string | LoginProvider) => {
    setAccounts((accounts) => accounts.filter((account) => account.provider !== providerOrSource));
  }, []);

  const update = useCallback(() => {
    sendMessage(iframe, 'accounts.all', null).then(({ accounts }) => {
      setAccounts(accounts);
    });
  }, []);

  const unlock = useCallback(async (passphrase: string) => {
    await sendMessage(iframe, 'unlock', { passphrase: blake2AsHex(passphrase) });
    setIsLocked(false);
  }, []);

  const logout = useCallback(() => {
    sendMessage(iframe, 'logout', null);
    setIsLocked(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <WalletContext.Provider
        value={{
          enableWebWallet,
          enableAuthenticator,
          isLocked,
          accounts,
          signOpen,
          connect: connect as ConnectFn,
          disconnect,
          encrypt,
          getProof,
          isReady,
          update,
          unlock,
          theme: theme || defaultTheme,
          providers,
          logout
        }}
      >
        {children}
      </WalletContext.Provider>
    </ThemeProvider>
  );
}

export default WalletProvider;
