// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import styled from '@emotion/styled';
import { useContext, useMemo, useState } from 'react';

import defaultHeader from '../assets/kzero-bg.webp';
import Button from '../components/Button.js';
import Divider from '../components/Divider.js';
import PoweredBy from '../components/PoweredBy.js';
import { WalletContext } from '../context.js';
import Socials from '../icons/Socials.js';
import { providerMapping } from '../providers/index.js';
import RemainProviders from './RemainProviders.js';
import Wrapper from './Wrapper.js';

const Header = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const Content = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 10
});

function Welcome({ handleProviderClick }: { handleProviderClick: (provider: LoginProvider) => void }) {
  const { theme, providers } = useContext(WalletContext);
  const [topProviders, remainingProviders] = useMemo(
    () => (providers.length > 5 ? [providers.slice(0, 4), providers.slice(4)] : [providers, []]),
    [providers]
  );
  const [showRemainingProviders, setShowRemainingProviders] = useState<boolean>(false);

  if (showRemainingProviders) {
    return (
      <RemainProviders
        providers={remainingProviders}
        handleProviderClick={handleProviderClick}
        onBack={() => setShowRemainingProviders(false)}
      />
    );
  }

  return (
    <Wrapper>
      <Header>
        <img
          src={theme.customHeader || defaultHeader}
          alt='header img'
          style={{
            width: 'auto',
            height: 100,
            objectFit: 'contain',
            objectPosition: 'center',
            borderRadius: 'var(--kzero-radius-button)'
          }}
        />
      </Header>

      <div style={{ textAlign: 'center' }}>Login or Sign up</div>

      <Divider />

      <Content>
        {topProviders.map((provider) => {
          const Component = providerMapping[provider];

          return <Component key={provider} onClick={handleProviderClick} />;
        })}
        {remainingProviders.length > 0 && (
          <Button align='left' onClick={() => setShowRemainingProviders(true)}>
            <Socials />
            Other socials
          </Button>
        )}
      </Content>

      <PoweredBy showAccount={false} />
    </Wrapper>
  );
}

export default Welcome;
