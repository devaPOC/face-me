import React from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-display-lg text-white mb-2">Thanks for using FaceMe!</h2>
        <p className="text-white/70 font-body-md mb-8">
          FaceMe is a free, open-source project. If you found it useful, consider supporting its development or getting in touch!
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <a href="https://buymeacoffee.com/tmsankaram" target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-3 bg-[#FFDD00] text-black px-6 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#FFDD00]/20">
            <span className="text-2xl">☕</span> Buy me a coffee
          </a>

          <a href="mailto:tmsankaram@gmail.com"
             className="flex items-center justify-center gap-3 bg-white/5 text-white px-6 py-4 rounded-xl font-title-md hover:bg-white/10 transition-colors border border-white/5">
            <span className="material-symbols-outlined">mail</span>
            tmsankaram@gmail.com
          </a>
        </div>

        <button onClick={onClose} className="w-full py-3 px-4 rounded-full font-title-md bg-white text-black hover:bg-gray-200 shadow-lg transition-all">
          Close
        </button>
      </div>
    </div>
  );
}
