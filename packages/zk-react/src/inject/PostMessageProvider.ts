// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default class PostMessageProvider {
  public get isClonable(): boolean {
    return true;
  }

  public clone(): PostMessageProvider {
    return new PostMessageProvider();
  }

  public async connect(): Promise<void> {
    // FIXME This should see if the extension's state's provider can disconnect
    console.error('PostMessageProvider.disconnect() is not implemented.');
  }

  public async disconnect(): Promise<void> {
    // FIXME This should see if the extension's state's provider can disconnect
    console.error('PostMessageProvider.disconnect() is not implemented.');
  }

  public get hasSubscriptions(): boolean {
    // FIXME This should see if the extension's state's provider has subscriptions
    return true;
  }

  public get isConnected(): boolean {
    return false;
  }

  public listProviders(): Promise<[]> {
    return Promise.resolve([]);
  }

  public on(): () => void {
    throw new Error('Not implemented');
  }

  public async send(): Promise<any> {
    throw new Error('Not implemented');
  }

  public async startProvider(): Promise<any> {
    throw new Error('Not implemented');
  }

  public subscribe(): Promise<number> {
    throw new Error('Not implemented');
  }

  public async unsubscribe(): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
