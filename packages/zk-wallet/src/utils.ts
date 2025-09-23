// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hex, ZkAccount } from '@kzero/zk-core';

import { hexToU8a } from '@polkadot/util/hex/toU8a';
import { blake2AsU8a } from '@polkadot/util-crypto';

import { decrypt } from './crypto/decrypt.js';

// @internal
// Get passphrase from session storage
export function _getPassphrase(): string | null {
  return JSON.parse(sessionStorage.getItem('passphrase') || 'null');
}

// @internal
// Set passphrase to session storage
export function _setPassphrase(passphrase: string | null) {
  sessionStorage.setItem('passphrase', JSON.stringify(passphrase));
}

export function _clearPassphrase() {
  sessionStorage.removeItem('passphrase');
}

export function unlock(passphrase: string) {
  const account = getZkAccount();

  if (!account) {
    throw new Error('No accounts found');
  }

  const encryptedPrivateKey = JSON.parse(
    localStorage.getItem(`ephemeral_keypair:${account.ephemeralPublicKey}`) || 'null'
  ) as Hex;

  if (encryptedPrivateKey) {
    decrypt(hexToU8a(encryptedPrivateKey), blake2AsU8a(passphrase));
  }

  _setPassphrase(passphrase);
}

export function getZkAccount(ephemeralPublicKey?: Hex): ZkAccount | null {
  const account = JSON.parse(localStorage.getItem('zk-account') || 'null');

  if (ephemeralPublicKey) {
    return account && account.ephemeralPublicKey === ephemeralPublicKey ? account : null;
  }

  return account;
}
