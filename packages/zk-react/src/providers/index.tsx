// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LoginProvider } from '@kzero/zk-core';

import AppleIcon from '../icons/Apple.js';
import DiscordIcon from '../icons/Discord.js';
import GithubIcon from '../icons/Github.js';
import GoogleIcon from '../icons/Google.js';
import TelegramIcon from '../icons/Telegram.js';
import TwitterIcon from '../icons/X.js';
import AppleProvider from './AppleProvider.js';
import DiscordProvider from './DiscordProvider.js';
import GithubProvider from './GithubProvider.js';
import GoogleProvider from './GoogleProvider.js';
import TelegramProvider from './TelegramProvider.js';
import TwitterProvider from './TwitterProvider.js';

export const providerMapping: Record<
  LoginProvider,
  React.ComponentType<{ onClick: (provider: LoginProvider) => void }>
> = {
  google: GoogleProvider,
  twitter: TwitterProvider,
  apple: AppleProvider,
  github: GithubProvider,
  telegram: TelegramProvider,
  discord: DiscordProvider
};

export const providerIconMapping: Record<LoginProvider, React.ComponentType<{ style?: React.CSSProperties }>> = {
  google: GoogleIcon,
  twitter: TwitterIcon,
  apple: AppleIcon,
  github: GithubIcon,
  telegram: TelegramIcon,
  discord: DiscordIcon
};

export const providerNameMapping: Record<LoginProvider, string> = {
  google: 'Google',
  twitter: 'Twitter',
  apple: 'Apple',
  github: 'Github',
  telegram: 'Telegram',
  discord: 'Discord'
};
