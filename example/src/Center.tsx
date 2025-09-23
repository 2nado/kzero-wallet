// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';

import { useAccounts, WalletCard } from '@kzero/zk-react';

function Center() {
  const accounts = useAccounts();

  const account = accounts.at(0);

  if (account && account.status === 'ready') {
    return null;
  }

  return (
    <Box sx={({ shadows }) => ({ '&>div': { boxShadow: shadows[1] } })}>
      <WalletCard />
    </Box>
  );
}

export default Center;
