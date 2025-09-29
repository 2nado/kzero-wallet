// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { KeyringPair } from '@polkadot/keyring/types';

import { ApiPromise } from '@polkadot/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prepareCall } from './parseCall';

describe('prepareCall', () => {
  let mockApi: ApiPromise;
  let mockPair: KeyringPair;
  let mockProof: any;

  beforeEach(() => {
    // Mock ApiPromise
    const mockTx = vi.fn();
    const mockRegistryCreateType = vi.fn();
    const mockCreateType = vi.fn();
    const mockQueryAccount = vi.fn();

    mockApi = {
      tx: mockTx,
      registry: {
        createType: mockRegistryCreateType
      },
      createType: mockCreateType,
      query: {
        system: {
          account: mockQueryAccount
        }
      },
      genesisHash: '0x1234',
      runtimeVersion: { specVersion: 1 }
    } as unknown as ApiPromise;

    // Mock keyring pair
    mockPair = {
      address: '0x1234567890abcdef',
      publicKey: new Uint8Array(32).fill(1),
      secretKey: new Uint8Array(64).fill(2)
    } as unknown as KeyringPair;

    // Mock proof data
    mockProof = {
      kid: 1,
      proof: {
        proof_points: {
          a: ['1', '2', '3'],
          b: [
            ['1', '2'],
            ['3', '4'],
            ['5', '6']
          ],
          c: ['7', '8', '9']
        },
        iss_base64_details: {
          value: '123456789',
          index_mod_4: 0
        },
        header: '987654321'
      },
      maxEpoch: '1000',
      zkAddress: '0xabcdef1234567890'
    };

    // Setup default mocks
    const mockCall = {
      sign: vi.fn().mockReturnValue({
        toU8a: vi.fn().mockReturnValue(new Uint8Array(100))
      })
    };

    mockTx.mockImplementation(() => mockCall);
    mockRegistryCreateType.mockImplementation(() => mockCall);

    mockCreateType.mockImplementation((type: string) => {
      if (type === 'U256') {
        return {
          toU8a: vi.fn().mockReturnValue(new Uint8Array(32))
        };
      }

      if (type === 'Bytes') {
        return {
          toU8a: vi.fn().mockReturnValue(new Uint8Array(20))
        };
      }

      return {
        toU8a: vi.fn().mockReturnValue(new Uint8Array(10))
      };
    });

    mockQueryAccount.mockResolvedValue({
      nonce: { toNumber: () => 1 }
    });
  });

  it('should prepare call successfully', async () => {
    const method = '0xabcd';

    const result = await prepareCall(mockApi, method, mockPair, mockProof);

    expect(result).toHaveProperty('uxt');
    expect(result).toHaveProperty('zkMaterial');
    expect(result).toHaveProperty('address');
    expect(result.address).toBe('0xabcdef1234567890');
  });

  it('should create transaction with correct call', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    expect(mockApi.tx).toHaveBeenCalled();
    expect(mockApi.registry.createType).toHaveBeenCalledWith('Call', method);
  });

  it('should create JWK provider as Google for now', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    expect(mockApi.createType).toHaveBeenCalledWith('PrimitiveZkloginJwkProvider', 'Google');
  });

  it('should create ZK inputs with correct structure', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    const zkInputsCall = (mockApi.createType as any).mock.calls.find(
      (call: any) => call[0] === 'PrimitiveZkloginZkInputZkLoginInputs'
    );

    expect(zkInputsCall).toBeDefined();
    expect(zkInputsCall[1]).toHaveProperty('proofPoints');
    expect(zkInputsCall[1]).toHaveProperty('issBase64Details');
    expect(zkInputsCall[1]).toHaveProperty('header');

    // Check proof points structure
    expect(zkInputsCall[1].proofPoints).toHaveProperty('a');
    expect(zkInputsCall[1].proofPoints).toHaveProperty('b');
    expect(zkInputsCall[1].proofPoints).toHaveProperty('c');
  });

  it('should create ZK material with V1 structure', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    const zkMaterialCall = (mockApi.createType as any).mock.calls.find(
      (call: any) => call[0] === 'PrimitiveZkloginVersionedZkMaterial'
    );

    expect(zkMaterialCall).toBeDefined();
    expect(zkMaterialCall[1]).toHaveProperty('V1');
    expect(zkMaterialCall[1].V1).toHaveProperty('provider');
    expect(zkMaterialCall[1].V1).toHaveProperty('kid');
    expect(zkMaterialCall[1].V1).toHaveProperty('inputs');
    expect(zkMaterialCall[1].V1).toHaveProperty('ephkey_expire_at');
  });

  it('should query account nonce', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    expect(mockApi.query.system.account).toHaveBeenCalledWith('0xabcdef1234567890');
  });

  it('should sign transaction with correct parameters', async () => {
    const method = '0xabcd';

    await prepareCall(mockApi, method, mockPair, mockProof);

    // Verify that sign was called
    expect(mockApi.tx).toHaveBeenCalled();

    // Get the mock call that was created and verify sign was called
    const mockCall = (mockApi.tx as any).mock.results[0].value;

    expect(mockCall.sign).toHaveBeenCalledWith(mockPair, expect.any(Object));
  });

  it('should handle different proof point structures', async () => {
    const method = '0xabcd';

    // Test with different proof structure
    const customProof = {
      ...mockProof,
      proof: {
        proof_points: {
          a: ['100', '200', '300'],
          b: [
            ['400', '500'],
            ['600', '700'],
            ['800', '900']
          ],
          c: ['1000', '1100', '1200']
        },
        iss_base64_details: {
          value: '999999999',
          index_mod_4: 2
        },
        header: '888888888'
      }
    };

    await prepareCall(mockApi, method, mockPair, customProof);

    expect(mockApi.createType).toHaveBeenCalledWith('PrimitiveZkloginZkInputZkLoginInputs', expect.any(Object));
  });

  it('should return correct structure', async () => {
    const method = '0xabcd';

    const result = await prepareCall(mockApi, method, mockPair, mockProof);

    expect(result).toEqual({
      uxt: expect.any(Object),
      zkMaterial: expect.any(Object),
      address: '0xabcdef1234567890'
    });
  });
});
