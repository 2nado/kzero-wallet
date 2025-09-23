// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from '@emotion/styled';
import React, { useState } from 'react';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode;
}

const Wrapper = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  '& > :first-of-type': {
    zIndex: 0
  },
  '& > *': {
    zIndex: 1
  }
});

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, width, height, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <Wrapper style={{ width, height }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--kzero-primary-color)',
          opacity: 0.05
        }}
      />
      {error ? fallback : <img src={src} alt={alt} onError={handleError} width='100%' height='100%' {...props} />}
    </Wrapper>
  );
};

export default React.memo(Avatar);
