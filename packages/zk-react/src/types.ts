// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hex, LoginProvider, Proof, SignerResult, ZkAccount } from '@kzero/zk-core';

export interface WalletContextType {
  isReady: boolean;
  isLocked: boolean;
  accounts: ZkAccount[];
  update: () => void;
  theme: WalletTheme;
  providers: LoginProvider[];
  enableWebWallet: boolean;
  enableAuthenticator: boolean;
  signOpen:
    | {
        signOpen: true;
        id: string;
        method: string;
        address: string;
        callback: (result: SignerResult) => void;
        onError: (reason: string) => void;
      }
    | { signOpen: false };
  getProof: (ephemeralPublicKey: Hex) => Promise<Proof | null>;
  connect(type: 'zk', provider: LoginProvider): Promise<Hex>;
  connect(type: 'injected', source: string): Promise<void>;
  connect(type: 'zk' | 'injected', sourceOrProvider: string | LoginProvider): Promise<Hex | void>;
  disconnect(providerOrSource: string | LoginProvider): void;
  encrypt(ephemeralPublicKey: Hex, passphrase?: string): Promise<void>;
  unlock(passphrase: string): Promise<void>;
  logout(): void;
}

export interface BaseWalletTheme {
  radius: {
    card: string | number;
    button: string | number;
  };
}

export interface WalletTheme extends BaseWalletTheme {
  colors: {
    background: string;
    text: string;
    primaryColor: string;
    primaryContrastColor: string;
    secondaryColor: string;
    secondaryContrastColor: string;
    successColor: string;
    successContrastColor: string;
    errorColor: string;
    errorContrastColor: string;
    warningColor: string;
    warningContrastColor: string;
    borderColor: string;
    dividerColor: string;
  };
  button: {
    disabledBackgroundColor: string;
    disabledTextColor: string;
  };
  customHeader?: string;
}
