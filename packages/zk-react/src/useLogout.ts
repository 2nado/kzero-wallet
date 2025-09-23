// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import { useContext } from 'react';

import { WalletContext } from './context.js';

export function useLogout() {
  const { logout } = useContext(WalletContext);

  return logout;
}
