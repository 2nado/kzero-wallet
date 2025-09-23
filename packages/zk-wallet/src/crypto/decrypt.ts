// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import { naclDecrypt, NONCE_LENGTH } from './nacl.js';
import { SCRYPT_LENGTH, scryptEncode, scryptFromU8a } from './scrypt.js';

/**
 * @description Decrypt a message using the supplied passphrase.
 */
export function decrypt(encrypted: Uint8Array, passphrase: Uint8Array): Uint8Array {
  const { params, salt } = scryptFromU8a(encrypted);
  const { password } = scryptEncode(passphrase, salt, params);

  encrypted = encrypted.subarray(SCRYPT_LENGTH);

  const decoded = naclDecrypt(
    encrypted.subarray(NONCE_LENGTH),
    encrypted.subarray(0, NONCE_LENGTH),
    password.subarray(0, 32)
  );

  if (!decoded) throw new Error('Unable to decrypt using the supplied passphrase');

  return decoded;
}
