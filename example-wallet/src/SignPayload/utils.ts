// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { Hex, Proof, ZkAccount } from '@kzero/zk-core';

import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

export function getAccount(address?: string): ZkAccount | null {
  const account: ZkAccount | null = JSON.parse(localStorage.getItem('zk-account') || 'null');

  if (address) {
    return account && account.address === u8aToHex(decodeAddress(address)) ? account : null;
  }

  return account;
}

export function getProof(ephemeralPublicKey: Hex): Proof | null {
  return JSON.parse(localStorage.getItem(`proof:${ephemeralPublicKey}`) || 'null');
}
