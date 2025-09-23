// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { LoginProvider } from '@kzero/zk-core';

import Button from '../components/Button.js';
import GoogleIcon from '../icons/Google.js';

function GoogleProvider({ onClick }: { onClick: (provider: LoginProvider) => void }) {
  return (
    <Button align='left' onClick={() => onClick('google')}>
      <GoogleIcon style={{ width: 20, height: 20 }} />
      Google
    </Button>
  );
}

export default GoogleProvider;
