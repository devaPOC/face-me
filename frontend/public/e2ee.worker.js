const XOR_KEY = new Uint8Array([0x5A, 0x3C, 0x99, 0x1F, 0xAA, 0x55, 0x77, 0xFF]);

onmessage = (event) => {
  // Can receive keys here if needed
};

onrtctransform = async (event) => {
  const transformer = event.transformer;
  const { operation, key } = transformer.options;

  // Derive a simple numeric seed from the room ID
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = (seed + key.charCodeAt(i)) % 256;
  }

  transformer.readable.pipeThrough(new TransformStream({
    transform(frame, controller) {
      const data = new Uint8Array(frame.data);
      
      // Leave first 10 bytes unencrypted for video, 1 byte for audio
      const offset = frame.type === undefined ? 1 : 10;
      
      if (data.length > offset) {
        // Modify in place! Synchronous, zero-allocation E2EE cipher.
        for (let i = offset; i < data.length; i++) {
          data[i] ^= (XOR_KEY[(i - offset) % XOR_KEY.length] ^ seed);
        }
      }
      
      controller.enqueue(frame);
    }
  })).pipeTo(transformer.writable);
};
