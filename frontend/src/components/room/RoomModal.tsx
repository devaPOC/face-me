import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Crown, Clock, X, Check, Paperclip, Send } from 'lucide-react';

interface RoomModalProps {
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

export default function RoomModal({
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
}: RoomModalProps) {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>{activeTab === 'people' || status !== 'IN_CALL' ? 'Waiting Room' : 'In-call messages'}</DialogTitle>
          <DialogDescription className="sr-only">Participants and chat</DialogDescription>
        </DialogHeader>

        {activeTab === 'people' || status !== 'IN_CALL' ? (
          <div className="flex-1 overflow-y-auto p-4">
            {/* In Call Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                In call ({inCallCount})
              </h3>
              <div className="space-y-1">
                {/* Self */}
                {localName && (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                      {localName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{localName}</p>
                      <p className="text-xs text-muted-foreground">You{isActuallyCreator ? ' · Host' : ''}</p>
                    </div>
                    {isActuallyCreator && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                )}

                {/* Remote participant */}
                {status === 'IN_CALL' && remoteName && (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold shrink-0">
                      {remoteName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{remoteName}</p>
                      <p className="text-xs text-muted-foreground">{!isActuallyCreator ? 'Host' : 'Guest'}</p>
                    </div>
                    {!isActuallyCreator && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Waiting Room Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Waiting room ({waitingCount})
              </h3>

              {waitingCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No one is waiting</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {status === 'PROMPTING_CREATOR' && remoteName && (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 text-sm font-semibold shrink-0">
                        {remoteName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{remoteName}</p>
                        <p className="text-xs text-muted-foreground">Requesting to join</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={rejectGuest}
                          className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Deny"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => { admitGuest(); setActiveTab('people'); }}
                          className="cursor-pointer text-green-500 hover:text-green-500 hover:bg-green-500/10"
                          title="Admit"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <p className="text-sm">No messages yet.</p>
                  <p className="text-xs">Start a conversation with the guest!</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isMe = msg.sender === localName;
                  return (
                    <div key={i} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <span className="text-[10px] text-muted-foreground mb-1">{msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                        {msg.isFile ? (
                          <a href={msg.fileUrl} download={msg.fileName} className="flex items-center gap-2 underline underline-offset-2">
                            <Paperclip className="w-4 h-4" />
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
            <div className="p-3 border-t bg-background mt-auto">
              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input type="file" className="hidden" ref={fileInputRef as any} onChange={handleFileChange} />
                <Button type="button" variant="ghost" size="icon" className="shrink-0 cursor-pointer text-muted-foreground" onClick={() => fileInputRef.current?.click()} title="Attach file">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={chatText}
                  onChange={e => setChatText(e.target.value)}
                />
                <Button type="submit" size="icon" className="shrink-0 cursor-pointer" disabled={!chatText.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
