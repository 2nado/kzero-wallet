// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { ApiPromise } from '@polkadot/api';
import type { GenericCall } from '@polkadot/types';
import type { AnyTuple } from '@polkadot/types-codec/types';
import type { Circle } from '@polkadot/ui-shared/icons/types';

import styled from '@emotion/styled';
import { polkadotIcon } from '@polkadot/ui-shared';
import { useMemo } from 'react';

import { formatDisplay, formatUnits } from '../utils/units';

const Wrapper = styled.div({
  padding: '20px 10px',
  backgroundColor: 'var(--kzero-secondary-color)',
  color: 'var(--kzero-text-color)',
  borderRadius: 10,
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center',
  '& > svg': {
    verticalAlign: 'middle'
  },
  '& > .light-text': {
    opacity: 0.5
  }
});

const circlesFunc = () => {
  const map = new Map<string, Circle[]>();

  return (address: string): Circle[] => {
    if (map.has(address)) {
      return map.get(address) as Circle[];
    }

    const circles = polkadotIcon(address, { isAlternative: false });

    map.set(address, circles);

    return circles;
  };
};

const getCircles = circlesFunc();

function renderCircle({ cx, cy, fill, r }: Circle, index: number) {
  return <circle key={index} cx={cx} cy={cy} fill={fill} r={r} />;
}

function CallDisplay({ api, call }: { api: ApiPromise; call: GenericCall }) {
  const [section, method, ...args] = useMemo((): [section: string, method: string, ...args: AnyTuple] => {
    return [call.section, call.method, ...call.args];
  }, [call]);
  const decimals = useMemo(() => api.registry.chainDecimals[0], [api]);

  if (
    section === 'balances' &&
    (method === 'transfer' ||
      method === 'transferKeepAlive' ||
      method === 'transferAll' ||
      method === 'transferAllowDeath')
  ) {
    const dest = args[0].toString();
    const destCircles = getCircles(dest);
    const amount = args[1].toString();

    const formated = formatDisplay(formatUnits(amount, decimals));

    return (
      <Wrapper>
        <span className='light-text'>Transfer</span>&nbsp;
        <b style={{ fontWeight: 600 }}>
          {formated[0]}
          {formated[1] ? `.${formated[1]}` : ''}
          {formated[2] || ''}
        </b>
        &nbsp;{api.registry.chainTokens[0]}
        <br />
        <span className='light-text'>To</span>&nbsp;
        <svg viewBox='0 0 64 64' width={20} height={20}>
          {destCircles.map(renderCircle)}
        </svg>
        &nbsp;
        <b style={{ fontWeight: 600, cursor: 'copy' }} onClick={() => navigator.clipboard.writeText(dest)}>
          {dest.slice(0, 6)}...{dest.slice(-6)}
        </b>
      </Wrapper>
    );
  }

  return null;
}

export default CallDisplay;
