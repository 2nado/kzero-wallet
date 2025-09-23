// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import nacl from 'tweetnacl';

export const NONCE_LENGTH = 24;

import { randomAsU8a } from '@polkadot/util-crypto';

/**
 * @description Returns an encrypted message, using the `secretKey` and `nonce`. If the `nonce` was not supplied, a random value is generated.
 */
export function naclEncrypt(message: Uint8Array, secret: Uint8Array, nonce = randomAsU8a(NONCE_LENGTH)) {
  const messageU8a = message;
  const nonceU8a = nonce;
  const secretU8a = secret;

  return {
    encrypted: nacl.secretbox(messageU8a, nonceU8a, secretU8a),
    nonce: nonceU8a
  };
}

/**
 * @description Returns an decrypted message, using the `secret` and `nonce`.
 */
export function naclDecrypt(encrypted: Uint8Array, nonce: Uint8Array, secret: Uint8Array) {
  const encryptedU8a = encrypted;
  const nonceU8a = nonce;
  const secretU8a = secret;

  return nacl.secretbox.open(encryptedU8a, nonceU8a, secretU8a) || null;
}
