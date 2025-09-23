// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import './style.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { lightTheme } from '@kzero/zk-react/defaults';
import ThemeProvider from '@kzero/zk-react/ThemeProvider';

import App from './App.js';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
