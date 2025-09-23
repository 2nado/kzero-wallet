// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { LoginProvider } from '@kzero/zk-core';

import Button from '../components/Button.js';
import TwitterIcon from '../icons/X.js';

function TwitterProvider({ onClick }: { onClick: (provider: LoginProvider) => void }) {
  return (
    <Button align='left' onClick={() => onClick('twitter')}>
      <TwitterIcon style={{ width: 20, height: 20 }} />
      Twitter
    </Button>
  );
}

export default TwitterProvider;
