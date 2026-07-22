'use client';

import React, { useEffect, useRef } from 'react';

export default function BuyMeACoffee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector('script')) return; // Prevent double injection

    // We must intercept document.writeln because the provided script uses it.
    // React blocks document.writeln, and async scripts ignore it.
    const originalWriteln = document.writeln;
    document.writeln = function (text) {
      if (containerRef.current) {
        containerRef.current.innerHTML += text;
      }
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'tmsankaram');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Poppins');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');

    script.onload = () => {
      document.writeln = originalWriteln; // Restore immediately after execution
    };

    containerRef.current.appendChild(script);

    return () => {
      document.writeln = originalWriteln;
    };
  }, []);

  return (
    <div className="flex justify-center md:justify-end scale-[0.65] md:scale-[0.65] origin-center md:origin-right h-[40px] items-center -mr-2 md:-mr-0">
      <div ref={containerRef} className="flex items-center"></div>
    </div>
  );
}
