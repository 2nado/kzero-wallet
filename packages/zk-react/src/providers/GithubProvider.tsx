// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import Button from '../components/Button.js';
import GithubIcon from '../icons/Github.js';

function GithubProvider({ onClick }: { onClick: (provider: LoginProvider) => void }) {
  return (
    <Button align='left' onClick={() => onClick('github')}>
      <GithubIcon style={{ width: 20, height: 20 }} />
      Github
    </Button>
  );
}

export default GithubProvider;
