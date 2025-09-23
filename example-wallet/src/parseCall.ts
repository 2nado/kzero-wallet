// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import { ApiPromise } from '@polkadot/api';
import { bnToU8a } from '@polkadot/util';

export const prepareCall = async (
  api: ApiPromise,
  _call: string,
  pair: KeyringPair,
  { kid, proof, maxEpoch, zkAddress }: any
) => {
  const call = api.tx(api.registry.createType('Call', _call));

  const jwkProvider = api.createType('PrimitiveZkloginJwkProvider', 'Google');

  const inputs = api.createType('PrimitiveZkloginZkInputZkLoginInputs', {
    proofPoints: {
      a: proof.proof_points.a, // u256
      b: proof.proof_points.b,
      c: proof.proof_points.c
    },
    issBase64Details: {
      value: bnToU8a(BigInt(proof.iss_base64_details.value)),
      indexMod4: proof.iss_base64_details.index_mod_4
    },
    header: bnToU8a(BigInt(proof.header))
  });

  const zkMaterial = api.createType('PrimitiveZkloginZkMaterial', {
    provider: jwkProvider,
    kid: kid,
    inputs: inputs,
    ephkeyExpireAt: maxEpoch
  });

  const { nonce }: any = await api.query.system.account(zkAddress);
  const uxt = call.sign(pair, {
    blockHash: api.genesisHash,
    genesisHash: api.genesisHash,
    nonce: nonce,
    runtimeVersion: api.runtimeVersion
  });

  return {
    uxt,
    zkMaterial,
    address: zkAddress
  };
};
