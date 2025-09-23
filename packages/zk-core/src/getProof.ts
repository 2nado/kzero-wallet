// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { Hex, Proof } from './types.js';

import { bnToHex } from '@polkadot/util';

export async function getProof(baseAuthUrl: string, ephemeralPublicKey: Hex): Promise<Proof> {
  return fetch(`${baseAuthUrl}/proof?ephemeral_public_key=${ephemeralPublicKey}`)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }

      throw new Error('Failed to get proof');
    })
    .then((data) => {
      return {
        ...data.results,
        updatedAt: new Date(data.results.updatedAt).getTime(),
        createdAt: new Date(data.results.createdAt).getTime(),
        zkAddress: data.results.addressSeed ? bnToHex(BigInt(data.results.addressSeed)) : undefined,
        ...(data.results.proof ? { proof: JSON.parse(data.results.proof) } : {})
      };
    });
}
