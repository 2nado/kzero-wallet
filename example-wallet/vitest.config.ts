// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true
  }
});
