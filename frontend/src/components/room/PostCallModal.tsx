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
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-display-lg text-white mb-2">Are you sure?</h2>
        <p className="text-white/70 font-body-md mb-8">
          Do you really want to leave this call?
        </p>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 px-4 rounded-full font-title-md text-white/70 hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirmLeave} className="flex-1 py-3 px-4 rounded-full font-title-md bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">
            Yes, Leave
          </button>
        </div>
      </div>
    </div>
  );
}
