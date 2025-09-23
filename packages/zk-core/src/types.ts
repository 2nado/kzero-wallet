// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

export type Hex = `0x${string}`;

export type LoginProvider = 'google' | 'twitter' | 'apple' | 'github' | 'telegram' | 'discord';

export type ZkAccount = {
  type: 'zk';
  address: Hex;
  provider: LoginProvider;
  ephemeralPublicKey: Hex;
  name: string;
  email?: string;
  picture?: string;
  status: 'pending' | 'encrypting' | 'ready';
  proofStatus: 'pending' | 'error' | 'generated';
};

export type Account =
  | ZkAccount
  | {
      type: 'injected';
      address: Hex;
      name?: string;
      source: string;
    };

export interface SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   */
  address: string;
  /**
   * @description The id of the asset used to pay fees, in hex
   */
  assetId?: number | object;
  /**
   * @description The checkpoint hash of the block, in hex
   */
  blockHash: Hex;
  /**
   * @description The checkpoint block number, in hex
   */
  blockNumber: Hex;
  /**
   * @description The era for this transaction, in hex
   */
  era: Hex;
  /**
   * @description The genesis hash of the chain, in hex
   */
  genesisHash: Hex;
  /**
   * @description The metadataHash for the CheckMetadataHash SignedExtension, as hex
   */
  metadataHash?: Hex;
  /**
   * @description The encoded method (with arguments) in hex
   */
  method: string;
  /**
   * @description The mode for the CheckMetadataHash SignedExtension, in hex
   */
  mode?: number;
  /**
   * @description The nonce for this transaction, in hex
   */
  nonce: Hex;
  /**
   * @description The current spec version for the runtime
   */
  specVersion: Hex;
  /**
   * @description The tip for this transaction, in hex
   */
  tip: Hex;
  /**
   * @description The current transaction version for the runtime
   */
  transactionVersion: Hex;
  /**
   * @description The applicable signed extensions for this runtime
   */
  signedExtensions: string[];
  /**
   * @description The version of the extrinsic we are dealing with
   */
  version: number;
  /**
   * @description Optional flag that enables the use of the `signedTransaction` field in
   * `singAndSend`, `signAsync`, and `dryRun`.
   */
  withSignedTransaction?: boolean;
}

export interface SignerResult {
  /**
   * @description The id for this request
   */
  id: string;
  /**
   * @description The resulting signature in hex
   */
  signature: Hex;
  /**
   * @description The payload constructed by the signer. This allows the
   * inputted signed transaction to bypass `signAndSend` from adding the signature to the payload,
   * and instead broadcasting the transaction directly. There is a small validation layer. Please refer
   * to the implementation for more information. If the inputted signed transaction is not actually signed, it will fail with an error.
   *
   * This will also work for `signAsync`. The new payload will be added to the Extrinsic, and will be sent once the consumer calls `.send()`.
   *
   * NOTE: This is only implemented for `signPayload`, and will only work when the `withSignedTransaction` option is enabled as an option.
   */
  signedTransaction?: Hex;
}

export interface MetadataDefBase {
  chain: string;
  genesisHash: Hex;
  icon: string;
  ss58Format: number;
  chainType?: 'substrate' | 'ethereum';
}
export interface MetadataDef extends MetadataDefBase {
  color?: string;
  specVersion: number;
  tokenDecimals: number;
  tokenSymbol: string;
  types: Record<string, Record<string, string> | string>;
  metaCalls?: string;
  userExtensions?: Record<string, any>;
}

type ErrorOrResponse<T> = { error?: never; response: T } | { error: string; response?: never };

export type MessageData = { id: string; error?: unknown } & (
  | ({
      type: 'wallet.ready';
      payload: null | undefined;
    } & ErrorOrResponse<null>)
  | ({
      type: 'theme.set';
      payload: any;
    } & ErrorOrResponse<null>)
  | ({
      type: 'isLocked';
      payload: null | undefined;
    } & ErrorOrResponse<{ isLocked: boolean }>)
  | ({
      type: 'unlock';
      payload: { passphrase: string };
    } & ErrorOrResponse<null>)
  | ({
      type: 'transaction.sign';
      payload: { data: Hex };
    } & ErrorOrResponse<{ signature: Hex; signedTransaction: Hex }>)
  | ({
      type: 'logout';
      payload: null | undefined;
    } & ErrorOrResponse<null>)
  | ({
      type: 'accounts.all';
      payload: null | undefined;
    } & ErrorOrResponse<{ accounts: ZkAccount[] }>)
  | ({
      type: 'accounts.retrieve';
      payload: { ephemeralPublicKey: Hex };
    } & ErrorOrResponse<{ account: ZkAccount }>)
  | ({
      type: 'proof.get';
      payload: { ephemeralPublicKey: Hex };
    } & ErrorOrResponse<{ proof: Proof | null }>)
  | ({
      type: 'ephemeral-key.generate';
      payload: null | undefined;
    } & ErrorOrResponse<{ publicKey: Hex }>)
  | ({
      type: 'ephemeral-key.encrypt';
      payload: { passphrase?: string; ephemeralPublicKey: Hex };
    } & ErrorOrResponse<null>)
  | ({
      type: 'metadata.list';
      payload: null | undefined;
    } & ErrorOrResponse<Array<{ genesisHash: string; specVersion: number }>>)
  | ({
      type: 'metadata.provide';
      payload: MetadataDef;
    } & ErrorOrResponse<boolean>)
);

export type RequestMessage = Omit<MessageData, 'response'>;

export type ResponseMessage = Omit<MessageData, 'payload'>;

export type Proof = {
  updatedAt: number; // timestamp
  createdAt: number; // timestamp
  maxEpoch: string;
  kid: number;
  email?: string;
  name: string;
  picture?: string;
  provider: LoginProvider;
} & (
  | { status: 'waiting' | 'generating'; zkAddress: Hex }
  | {
      status: 'generated';
      proof: {
        proof_points: {
          a: [string, string, string];
          b: [[string, string], [string, string], [string, string]];
          c: [string, string, string];
        };
        iss_base64_details: {
          value: string;
          index_mod_4: number;
        };
        header: string;
      };
      public: [`${number}`];
      zkAddress: Hex;
    }
  | { status: 'failed'; zkAddress?: Hex }
);

export type InjectedAccount = {
  address: string;
  name?: string;
  type: 'ed25519';
};
