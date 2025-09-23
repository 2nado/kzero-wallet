// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aConcat } from '@polkadot/util';

import { naclEncrypt } from './nacl.js';
import { scryptEncode, scryptToU8a } from './scrypt.js';

/**
 * @description Encrypt a message using the supplied passphrase.
 */
export function encrypt(bytes: Uint8Array, passphrase: Uint8Array): Uint8Array {
  const { params, password, salt } = scryptEncode(passphrase);
  const { encrypted, nonce } = naclEncrypt(bytes, password.subarray(0, 32));

  return u8aConcat(scryptToU8a(salt, params), nonce, encrypted);
}
