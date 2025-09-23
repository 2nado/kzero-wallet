// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: GPL-3.0

import type { MessageData, RequestMessage } from '@kzero/zk-core';

/**
 * @description IframeMessage is a class that provides a way to send and receive messages between the iframe and the parent window.
 */
class IframeMessage {
  private listeners: Map<MessageData['type'], Array<(id: string, payload: any, origin: string) => void>> = new Map();

  /**
   * @description Constructor for the IframeMessage class.
   */
  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * @description Handle a message from the parent window.
   */
  private handleMessage(event: MessageEvent<RequestMessage>) {
    const isTrusted = event.isTrusted; // Check if the event is trusted

    if (!isTrusted) {
      console.warn('Received an untrusted message:', event.data, event.origin);

      return; // Ignore untrusted messages
    }

    const { type, payload, id } = event.data;
    const origin = event.origin; // Get the origin of the message

    console.log(`Message received from origin: ${origin}`, id, type, payload);

    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach((listener) => listener(id, payload, origin));
    }
  }

  /**
   * @description Send a response message to the parent window.
   */
  public sendMessage<T extends MessageData['type']>(
    type: T,
    id: string,
    response: Extract<MessageData, { type: T }>['response']
  ) {
    window.parent.postMessage({ type, id, response }, '*');
  }

  /**
   * @description Send an error message to the parent window.
   */
  public sendError<T extends MessageData['type']>(type: T, id: string, error: string) {
    window.parent.postMessage({ type, id, error }, '*');
  }

  /**
   * @description Listen for a message from the parent window.
   */
  public onMessage<T extends MessageData['type']>(
    type: T,
    callback: (id: string, payload: Extract<MessageData, { type: T }>['payload'], origin: string) => void
  ) {
    this.listeners.set(type, [...(this.listeners.get(type) || []), callback]);
  }

  /**
   * @description Unlisten for a message from the parent window.
   */
  public offMessage(type: MessageData['type'], callback: (...args: unknown[]) => void) {
    this.listeners.set(
      type,
      (this.listeners.get(type) || []).filter((listener) => listener !== callback)
    );
  }
}

export default IframeMessage;
