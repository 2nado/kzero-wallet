// Copyright 2023-2024 kzero authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MessageData, RequestMessage, ResponseMessage } from '@kzero/zk-core';

let _id = 0;

// @internal
// @description Send a message to the iframe and wait for a response.
// @param iframe - The iframe element to send the message to.
// @param type - The type of the message to send.
// @param payload - The payload of the message to send.
// @returns A promise that resolves to the response of the message.
export function sendMessage<
  T extends MessageData['type'],
  Res = Extract<MessageData, { type: T; error?: never }>['response']
>(iframe: HTMLIFrameElement, type: T, payload: Extract<MessageData, { type: T }>['payload']): Promise<Res> {
  return new Promise<Res>((resolve, reject) => {
    const contentWindow = iframe.contentWindow;

    if (!contentWindow) {
      return reject(new Error('Iframe contentWindow is not available'));
    }

    // Create the message to be sent without the response property
    const message: RequestMessage = { id: `${++_id}.${Date.now().toString()}`, type, payload };

    // Here you would typically listen for a response from the iframe
    const handleMessage = (event: MessageEvent<ResponseMessage>) => {
      if (event.source === iframe.contentWindow) {
        const data = event.data;

        // Check if the response id matches the message id
        if (data.id === message.id) {
          if (data.error) {
            reject(new Error(data.error));
          } else {
            resolve(data.response as Res);
          }

          window.removeEventListener('message', handleMessage); // Clean up the event listener
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Send the message to the iframe's contentWindow
    contentWindow.postMessage(message, '*');
  });
}
