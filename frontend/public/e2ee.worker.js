onmessage = (event) => {
  // Can receive keys here if needed
};

onrtctransform = async (event) => {
  const transformer = event.transformer;
  const { operation, key } = transformer.options;

  // Derive a CryptoKey from the provided key string (e.g. roomId)
  // For production, a stronger KDF like PBKDF2 should be used.
  const enc = new TextEncoder();
  const rawKey = enc.encode(key.padEnd(32, '0').slice(0, 32)); // Simple 256-bit key for demo

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = new Uint8Array(12); // A fixed IV for demo (in production, attach dynamic IV to frame)

  if (operation === 'encode') {
    transformer.readable.pipeThrough(new TransformStream({
      async transform(frame, controller) {
        // Enqueue the frame directly for now if we can't encrypt, but let's encrypt the payload
        try {
          const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            frame.data
          );
          frame.data = encrypted;
          controller.enqueue(frame);
        } catch (e) {
          console.error("Encryption error:", e);
          controller.enqueue(frame); // fallback
        }
      }
    })).pipeTo(transformer.writable);
  } else if (operation === 'decode') {
    transformer.readable.pipeThrough(new TransformStream({
      async transform(frame, controller) {
        try {
          const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            frame.data
          );
          frame.data = decrypted;
          controller.enqueue(frame);
        } catch (e) {
          console.error("Decryption error:", e);
          controller.enqueue(frame); // fallback
        }
      }
    })).pipeTo(transformer.writable);
  }
};
