// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';

import { WalletContext } from './context.js';

export function useAccounts() {
  const { accounts } = useContext(WalletContext);

  return accounts;
}
