// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route, Routes } from 'react-router-dom';

import Auth from './Auth';
import Home from './Home';
import SignPayload from './SignPayload';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth/:provider/:ephemeralPublicKey' element={<Auth />} />
      <Route path='/sign-payload/:address/:method' element={<SignPayload />} />
    </Routes>
  );
}

export default App;
