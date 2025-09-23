// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import Button from '../components/Button.js';
import Divider from '../components/Divider.js';
import PoweredBy from '../components/PoweredBy.js';
import BackIcon from '../icons/Back.js';
import { providerMapping } from '../providers/index.js';
import Wrapper from './Wrapper.js';

interface RemainProvidersProps {
  providers: LoginProvider[];
  handleProviderClick: (provider: LoginProvider) => void;
  onBack: () => void;
}

function RemainProviders({ providers, handleProviderClick, onBack }: RemainProvidersProps) {
  return (
    <Wrapper>
      <Button iconOnly onClick={onBack}>
        <BackIcon />
      </Button>

      {providers.map((provider) => {
        const Component = providerMapping[provider];

        return <Component key={provider} onClick={handleProviderClick} />;
      })}
      <div style={{ flex: 1 }} />

      <Divider />

      <PoweredBy showAccount={false} />
    </Wrapper>
  );
}

export default RemainProviders;
