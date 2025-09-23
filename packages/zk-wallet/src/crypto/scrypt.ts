// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import { scrypt } from '@noble/hashes/scrypt';
import { bnToU8a, u8aConcat, u8aToBn } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';

export const DEFAULT_PARAMS = {
  N: 1 << 15,
  p: 1,
  r: 8
};

export const SCRYPT_LENGTH = 32 + 3 * 4;

const BN_LE_OPTS = {
  isLe: true
};
const BN_LE_32_OPTS = {
  bitLength: 32,
  isLe: true
};

/**
 * @description Encode a passphrase using scrypt.
 */
export function scryptEncode(
  passphrase: Uint8Array,
  salt: Uint8Array = randomAsU8a(32),
  params: {
    N: number;
    p: number;
    r: number;
  } = DEFAULT_PARAMS
) {
  return {
    params,
    password: scrypt(passphrase, salt, {
      dkLen: 64,
      ...params
    }),
    salt
  };
}

/**
 * @description Encode scrypt params into a Uint8Array.
 */
export function scryptToU8a(salt: Uint8Array, { N, p, r }: { N: number; p: number; r: number }) {
  return u8aConcat(salt, bnToU8a(N, BN_LE_32_OPTS), bnToU8a(p, BN_LE_32_OPTS), bnToU8a(r, BN_LE_32_OPTS));
}

/**
 * @description Decode scrypt params from a Uint8Array.
 */
export function scryptFromU8a(data: Uint8Array) {
  const salt = data.subarray(0, 32);
  const N = u8aToBn(data.subarray(32 + 0, 32 + 4), BN_LE_OPTS).toNumber();
  const p = u8aToBn(data.subarray(32 + 4, 32 + 8), BN_LE_OPTS).toNumber();
  const r = u8aToBn(data.subarray(32 + 8, 32 + 12), BN_LE_OPTS).toNumber();

  // FIXME At this moment we assume these to be fixed params, this is not a great idea since we lose flexibility
  // and updates for greater security. However we need some protection against carefully-crafted params that can
  // eat up CPU since these are user inputs. So we need to get very clever here, but atm we only allow the defaults
  // and if no match, bail out
  if (N !== DEFAULT_PARAMS.N || p !== DEFAULT_PARAMS.p || r !== DEFAULT_PARAMS.r) {
    throw new Error('Invalid injected scrypt params found');
  }

  return {
    params: {
      N,
      p,
      r
    },
    salt
  };
}
