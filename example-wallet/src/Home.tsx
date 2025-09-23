// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import { useEffect } from 'react';

import { WalletMessage } from '@kzero/zk-wallet';

function Home(): React.ReactNode {
  useEffect(() => {
    new WalletMessage();
    window.parent.postMessage({ type: 'wallet.ready' }, '*');
  }, []);

  return null;
}

export default Home;
