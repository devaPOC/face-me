import React, { useState } from 'react';
interface SideDrawerProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  activeTab: 'people' | 'chat';
  setActiveTab: (tab: 'people' | 'chat') => void;
  status: string;
  localName: string;
  remoteName: string;
  isActuallyCreator: boolean;
  waitingCount: number;
  inCallCount: number;
  chatMessages: any[];
  chatText: string;
  setChatText: (text: string) => void;
  handleSendChat: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  admitGuest: () => void;
  rejectGuest: () => void;
}

export default function SideDrawer({
  modalOpen,
  setModalOpen,
  activeTab,
  setActiveTab,
  status,
  localName,
  remoteName,
  isActuallyCreator,
  waitingCount,
  inCallCount,
  chatMessages,
  chatText,
  setChatText,
  handleSendChat,
  handleFileChange,
  fileInputRef,
  admitGuest,
  rejectGuest
}: SideDrawerProps) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div
      className={`fixed top-0 h-full w-80 lg:w-96 z-[60] flex flex-col py-6 bg-surface-container-lowest/95 dark:bg-primary/90 backdrop-blur-md shadow-2xl transition-all duration-500 ease-out border-l border-white/10 ${modalOpen ? 'right-0' : '-right-[400px]'}`}
      id="sideNav"
    >
      <div className="px-6 pb-4 flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-headline-lg text-[24px] text-primary dark:text-primary-fixed-dim">
            {activeTab === 'chat' ? 'In-call Messages' : 'People'}
          </h3>
        </div>
        <button className="p-2 hover:bg-surface-container rounded-full cursor-pointer" onClick={() => setModalOpen(false)}>
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-4 pb-4">
        {activeTab === 'people' ? (
          <div className="flex flex-col gap-6">
            
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-3 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors rounded-xl font-medium border border-secondary/20"
            >
              <span className="material-symbols-outlined text-[20px]">{showToast ? 'check' : 'content_copy'}</span>
              {showToast ? 'Copied!' : 'Copy Invite Link'}
            </button>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">In Call ({inCallCount})</h4>
              {localName && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-surface-container/30 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold">
                    {localName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface">{localName}</p>
                    <p className="text-xs text-on-surface-variant">You {isActuallyCreator ? '· Host' : ''}</p>
                  </div>
                </div>
              )}
              {status === 'IN_CALL' && remoteName && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-surface-container/30 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/20 text-secondary font-semibold">
                    {remoteName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface">{remoteName}</p>
                    <p className="text-xs text-on-surface-variant">{!isActuallyCreator ? 'Host' : 'Guest'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">Waiting ({waitingCount})</h4>
              {waitingCount === 0 ? (
                <p className="text-sm text-on-surface-variant ml-2">No one is waiting.</p>
              ) : (
                status === 'PROMPTING_CREATOR' && remoteName && (
                  <div className="flex items-center gap-3 px-3 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-semibold">
                      {remoteName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-500">{remoteName}</p>
                      <p className="text-xs text-amber-500/70">Wants to join</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={rejectGuest} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <button onClick={admitGuest} className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant my-auto">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">chat_bubble</span>
                  <p className="text-sm">No messages yet.</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isMe = msg.sender === localName;
                  return (
                    <div key={i} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <span className="text-[10px] text-on-surface-variant mb-1">{msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className={`px-4 py-2 text-sm ${isMe ? 'bg-secondary text-white rounded-2xl rounded-tr-sm shadow-sm' : 'bg-surface-container text-on-surface rounded-2xl rounded-tl-sm shadow-sm'}`}>
                        {msg.isFile ? (
                          <a href={msg.fileUrl} download={msg.fileName} className="flex items-center gap-2 underline underline-offset-2">
                            <span className="material-symbols-outlined text-[16px]">attach_file</span>
                            {msg.fileName}
                          </a>
                        ) : (
                          <p className="break-words">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendChat} className="mt-auto flex items-center gap-2 bg-surface-container/50 p-1.5 rounded-full border border-surface-container-highest">
              <input type="file" className="hidden" ref={fileInputRef as any} onChange={handleFileChange} />
              <button type="button" className="w-10 h-10 shrink-0 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full" onClick={() => fileInputRef.current?.click()} title="Attach file">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
              <input
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-body-md text-on-surface placeholder:text-on-surface-variant px-2"
                value={chatText}
                onChange={e => setChatText(e.target.value)}
              />
              <button type="submit" className="w-10 h-10 shrink-0 flex items-center justify-center bg-primary text-white rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100" disabled={!chatText.trim()}>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Toast Message */}
      {showToast && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          <span className="text-sm font-medium">Invite link copied!</span>
        </div>
      )}
    </div>
  );
}
