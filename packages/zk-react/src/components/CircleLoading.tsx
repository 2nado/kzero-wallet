// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.svg<{ success?: boolean; error?: boolean }>(({ success, error }) => ({
  display: 'block',
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: error ? 'var(--kzero-error-color)' : success ? 'var(--kzero-success-color)' : 'var(--kzero-primary-color)',
  transition: 'color 550ms ease',
  animation: `550ms linear 0s infinite normal none running ${rotate}`,
  '& > circle': {
    transition: 'stroke-dasharray 550ms ease',
    strokeDasharray: success || error ? '200px, 200px' : '40px, 200px'
  }
}));

function CircleLoading({
  size = 128,
  children,
  success,
  error
}: {
  size?: number;
  children?: React.ReactNode;
  success?: boolean;
  error?: boolean;
}) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div style={{ width: '100%', height: '100%' }}>
        <svg
          viewBox='22 22 44 44'
          style={{ display: 'block', position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
        >
          <circle
            cx='44'
            cy='44'
            r='20'
            fill='none'
            stroke='currentColor'
            opacity={0.05}
            strokeDasharray='200px, 200px'
            strokeDashoffset='0'
            strokeWidth='2'
            strokeLinecap='round'
          ></circle>
        </svg>
        <Loader
          viewBox='22 22 44 44'
          width='100%'
          height='100%'
          style={{ display: 'block', position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
          success={success}
          error={error}
        >
          <circle
            cx='44'
            cy='44'
            r='20'
            fill='none'
            stroke='currentColor'
            strokeDashoffset='0'
            strokeWidth='2'
            strokeLinecap='round'
          ></circle>
        </Loader>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default CircleLoading;
