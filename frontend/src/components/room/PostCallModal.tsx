import React from 'react';

interface PostCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
}

export default function PostCallModal({ isOpen, onClose, onConfirmLeave }: PostCallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-display-lg text-white mb-2">Leaving so soon?</h2>
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

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 px-4 rounded-full font-title-md text-white/70 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirmLeave} className="flex-1 py-3 px-4 rounded-full font-title-md bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">
            Leave Call
          </button>
        </div>
      </div>
    </div>
  );
}
