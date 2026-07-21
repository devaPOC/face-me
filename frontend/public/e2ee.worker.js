onmessage = (event) => {
  // Can receive keys here if needed
};

onrtctransform = async (event) => {
  const transformer = event.transformer;
  const { operation, key } = transformer.options;

  // Derive a CryptoKey from the provided key string
  const enc = new TextEncoder();
  const rawKey = await crypto.subtle.digest('SHA-256', enc.encode(key));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-CTR' },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = new Uint8Array(16); // AES-CTR requires a 16-byte counter block

  transformer.readable.pipeThrough(new TransformStream({
    async transform(frame, controller) {
      try {
        const data = new Uint8Array(frame.data);
        // Leave some bytes unencrypted for WebRTC to route/packetize properly.
        // For video frames (has type), leave 10 bytes for payload descriptor.
        // For audio frames (no type), leave 1 byte.
        let unencryptedBytes = 0;
        if (frame.type === 'key') {
          unencryptedBytes = 10;
        } else if (frame.type === 'delta') {
          unencryptedBytes = 3;
        } else if (frame.type === undefined) {
          unencryptedBytes = 1; // Audio
        }
        
        if (data.length <= unencryptedBytes) {
           controller.enqueue(frame);
           return;
        }

        const unencrypted = data.slice(0, unencryptedBytes);
        const payload = data.slice(unencryptedBytes);

        if (operation === 'encode') {
          const encryptedPayload = await crypto.subtle.encrypt(
            { name: 'AES-CTR', counter: iv, length: 64 },
            cryptoKey,
            payload
          );
          
          const newData = new Uint8Array(unencrypted.length + encryptedPayload.byteLength);
          newData.set(unencrypted, 0);
          newData.set(new Uint8Array(encryptedPayload), unencrypted.length);
          frame.data = newData.buffer;
        } else if (operation === 'decode') {
          const decryptedPayload = await crypto.subtle.decrypt(
            { name: 'AES-CTR', counter: iv, length: 64 },
            cryptoKey,
            payload
          );
          
          const newData = new Uint8Array(unencrypted.length + decryptedPayload.byteLength);
          newData.set(unencrypted, 0);
          newData.set(new Uint8Array(decryptedPayload), unencrypted.length);
          frame.data = newData.buffer;
        }
        controller.enqueue(frame);
      } catch (e) {
        console.error("E2EE error:", e);
        controller.enqueue(frame); // send unencrypted as fallback
      }
    }
  })).pipeTo(transformer.writable);
};
