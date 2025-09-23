// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import Button from '../components/Button.js';
import TelegramIcon from '../icons/Telegram.js';

function TelegramProvider({ onClick }: { onClick: (provider: LoginProvider) => void }) {
  return (
    <Button align='left' onClick={() => onClick('telegram')}>
      <TelegramIcon style={{ width: 20, height: 20 }} />
      Telegram
    </Button>
  );
}

export default TelegramProvider;
