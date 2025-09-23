// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from 'input-otp';
import React from 'react';

const shake = keyframes`
  0%,
  100% {
    transform: rotateZ(0deg);
  }
  20% {
    transform: rotateZ(-15deg);
  }
  40% {
    transform: rotateZ(10deg);
  }
  60% {
    transform: rotateZ(-5deg);
  }
  80% {
    transform: rotateZ(3deg);
  }
`;

const blink = keyframes`
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const PinInputSlot = styled.div<{ hasValue: boolean; isHidden: boolean; isError: boolean }>(
  ({ hasValue, isHidden, isError }) => ({
    boxSizing: 'border-box',
    flex: '1',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: '36px',
    textAlign: 'center',
    border: '1px solid var(--kzero-border-color)',
    borderRadius: 'var(--kzero-radius-button)',
    borderColor: isError ? 'var(--kzero-error-color)' : undefined,
    fontSize: '30px',
    fontWeight: 600,
    color: hasValue && isHidden ? '#FFFFFF' : isError ? 'var(--kzero-error-color)' : 'var(--kzero-primary-color)', // Change color based on value
    outline: 'none', // Remove the default outline
    backgroundColor:
      hasValue && isHidden ? (isError ? 'var(--kzero-error-color)' : 'var(--kzero-primary-color)') : 'transparent', // Change background color based on value
    transformStyle: 'preserve-3d',
    transform: isHidden ? 'rotateX(180deg)' : 'rotateX(0deg)',
    transition: 'transform 0.4s ease, background-color 0.4s ease',
    transformOrigin: 'center',
    animation: isError ? `${shake} 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)` : undefined
  })
);

const PinBlink = styled.div(() => ({
  width: '2px',
  height: '24px',
  backgroundColor: 'var(--kzero-primary-color)',
  animation: `${blink} 1s step-end infinite`
}));

const Wrapper = styled.div({
  '& > .Kzero_pin-input': {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '20px 0',
    perspective: '1000px'
  }
});

function Slot(props: SlotProps & { isError: boolean; isHidden: boolean }) {
  return (
    <PinInputSlot
      hasValue={!!props.char}
      isHidden={props.isHidden}
      isError={props.isError}
      style={{
        outline: props.isActive
          ? `2px solid ${props.isError ? 'var(--kzero-error-color)' : 'var(--kzero-primary-color)'}`
          : undefined
      }}
    >
      {props.char ? props.isHidden ? '-' : props.char : props.isActive ? <PinBlink /> : ''}
    </PinInputSlot>
  );
}

function PinInput({
  value,
  isHidden,
  isError,
  onComplete,
  onChange
}: {
  value?: string;
  isHidden: boolean;
  isError: boolean;
  onComplete: (pin: string) => void;
  onChange?: (pin: string) => void;
}) {
  return (
    <Wrapper className='Kzero_pin-wrapper'>
      <OTPInput
        autoFocus
        containerClassName='Kzero_pin-input'
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        pattern={REGEXP_ONLY_DIGITS}
        maxLength={6}
        render={({ slots }) =>
          slots.slice(0, 6).map((slot, idx) => <Slot isHidden={isHidden} isError={isError} key={idx} {...slot} />)
        }
      />
    </Wrapper>
  );
}

export default React.memo(PinInput);
