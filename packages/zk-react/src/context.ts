// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WalletContextType, WalletTheme } from './types.js';

import { createContext } from 'react';

export const WalletContext = createContext<WalletContextType>({ accounts: [] } as unknown as WalletContextType);

export const ThemeContext = createContext<WalletTheme>({} as unknown as WalletTheme);
