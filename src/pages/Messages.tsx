import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, CheckCheck, Check, Pin, Mic, Play, MessageSquare, ArrowLeft, Plus
} from "lucide-react";
import { cn } from "../lib/utils";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { useSocket } from "../context/SocketContext";

export default function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const { messages, sendMessage, send, currentUser } = useSocket();

  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [newChatUser, setNewChatUser] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const threadId = params.get('thread');
    if (threadId) {
      setActiveThreadId(threadId);
      setIsCreatingNew(false);
      navigate('/messages', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (activeThreadId && activeThreadId !== "ALL") {
      // request history sync on first entry if necessary
      send({ type: "sync_history", contact: activeThreadId });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThreadId]);

  // Derive threads from messages object
  const threads = Object.keys(messages).map(contact => {
    const msgs = messages[contact] || [];
    const lastMsg = msgs[msgs.length - 1];
    return {
      id: contact,
      name: contact === 'ALL' ? 'Global Space' : contact,
      isInitial: true,
      initial: contact === 'ALL' ? 'G' : contact.charAt(0).toUpperCase(),
      lastMessage: lastMsg?.body || '',
      timestamp: lastMsg?.timestamp ? lastMsg.timestamp.substring(11, 16) : '',
      messages: msgs
    };
  });

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isCreatingNew) {
      if (!newChatUser.trim()) return;
      sendMessage(newChatUser.trim(), inputText);
      setActiveThreadId(newChatUser.trim());
      setIsCreatingNew(false);
      setNewChatUser("");
    } else {
      if (!activeThreadId) return;
      sendMessage(activeThreadId, inputText);
    }
    setInputText("");
  };

  return (
    <div className="bg-background text-on-background font-body h-screen overflow-hidden flex antialiased">
      <Sidebar />

      <div className="ml-0 md:ml-[280px] flex-1 flex h-screen bg-background w-full">
        {/* LHS: Thread List */}
        <div className={cn(
          "w-full sm:w-[320px] border-r border-surface-container bg-surface flex-col h-full flex-shrink-0",
          (activeThreadId || isCreatingNew) ? "hidden md:flex" : "flex"
        )}>
          <div className="h-20 p-6 flex items-center justify-between border-b border-surface-container bg-surface-container-lowest/50 shrink-0">
            <h2 className="font-headline font-bold text-xl text-on-background">Messages</h2>
            <button 
              onClick={() => { setIsCreatingNew(true); setActiveThreadId(""); }}
              className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-surface-container-lowest/50 border-b border-surface-container flex-shrink-0">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full bg-surface-container-highest border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm font-label focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all text-on-background placeholder-on-surface-variant shadow-sm" 
                placeholder="Search conversations" 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar pb-20 md:pb-4">
            {threads.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  setIsCreatingNew(false);
                }}
                className={cn(
                  "p-3 rounded-xl transition-colors cursor-pointer flex items-center gap-3",
                  activeThreadId === thread.id ? "bg-surface-container-lowest ambient-shadow border border-surface-container" : "hover:bg-surface-container/50 border border-transparent"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline font-bold text-lg ring-2 ring-surface-container-lowest shadow-sm">
                    {thread.initial}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-body text-sm truncate font-semibold text-on-background">
                      {thread.name}
                    </h3>
                    <span className="font-label text-xs text-on-surface-variant">
                      {thread.timestamp}
                    </span>
                  </div>
                  <p className="font-body text-xs truncate text-on-surface-variant">
                     {thread.lastMessage}
                  </p>
                </div>
              </div>
            ))}
            {threads.length === 0 && (
              <div className="text-center p-4 text-sm text-on-surface-variant">No conversations yet.<br/>Click + to start one!</div>
            )}
          </div>
        </div>

        {/* RHS: Message Viewer */}
        <div className={cn(
          "flex-1 flex flex-col bg-surface relative h-full w-full",
          (!activeThreadId && !isCreatingNew) ? "hidden md:flex" : "flex"
        )}>
          {!activeThreadId && !isCreatingNew ? (
            <div className="flex flex-col items-center justify-center flex-1 text-on-surface-variant relative z-10">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-headline font-semibold text-lg">Your messages will appear here</p>
              <p className="text-sm mt-1">Select a conversation or start a new one to begin.</p>
            </div>
          ) : (
            <>
              <header className="h-20 px-4 md:px-6 flex items-center justify-between border-b border-surface-container bg-surface-container-lowest/50 shrink-0 relative z-10">
                <div className="flex items-center gap-3 md:gap-4 w-full">
                  <button onClick={() => { setActiveThreadId(""); setIsCreatingNew(false); }} className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-container">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {isCreatingNew ? (
                    <div className="flex items-center flex-1 gap-2">
                       <span className="font-headline font-semibold text-on-background whitespace-nowrap">To:</span>
                       <input
                          autoFocus
                          value={newChatUser}
                          onChange={(e) => setNewChatUser(e.target.value)}
                          placeholder="Enter username"
                          className="w-full max-w-sm bg-surface-container border border-transparent rounded-lg px-3 py-1.5 focus:border-primary focus:bg-surface-container-lowest outline-none text-sm font-label"
                       />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline font-bold text-lg ring-2 ring-primary/10 shadow-sm flex-shrink-0">
                        {activeThread?.initial}
                      </div>
                      <div>
                        <h2 className="font-headline font-bold text-lg text-on-background leading-tight truncate">{activeThread?.name}</h2>
                      </div>
                    </>
                  )}
                  
                </div>
                {!isCreatingNew && (
                  <div className="flex items-center gap-1 md:gap-3">
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors hidden sm:block">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors hidden sm:block">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors border-none md:border-l border-surface-container md:pl-4 md:rounded-none">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </header>
              
              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar pb-32">
                {!isCreatingNew && activeThread?.messages.map((msg: any, index: number) => {
                  const isMe = msg.sender === currentUser;
                  
                  return (
                    <div key={msg.msg_id || index} className={cn("flex gap-3 max-w-[90%] md:max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                      {!isMe ? (
                        <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                           <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs shadow-sm hidden sm:block ring-2 ring-surface-container-lowest">{activeThread.initial}</div>
                        </div>
                      ) : <div className="hidden sm:block w-8 flex-shrink-0" />}
                      
                      <div className={cn("flex flex-col relative group", isMe ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-4 md:px-5 py-3 rounded-2xl shadow-sm w-fit inline-block font-body text-sm leading-relaxed relative",
                          isMe ? "primary-gradient text-on-primary rounded-br-sm" : "bg-surface-container-lowest border border-surface-container text-on-surface rounded-bl-sm"
                        )}>
                          {msg.body}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="text-[10px] font-label text-on-surface-variant flex items-center">
                            {msg.timestamp ? msg.timestamp.substring(11, 16) : ""}
                          </span>
                          {isMe && (
                            <div className="flex items-center">
                              {msg.status === 'sent' && <Check className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />}
                              {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />}
                              {msg.status === 'seen' && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              <div className="absolute bottom-16 md:bottom-0 left-0 w-full p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-surface-container z-20">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto relative">
                  <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-primary/5 flex-shrink-0 cursor-pointer">
                    <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <div className="flex-1 relative group">
                    <input 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full bg-surface-container-low border border-transparent rounded-2xl pl-4 pr-20 py-3 text-sm font-body text-on-background placeholder-on-surface-variant focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                      placeholder="Type a message..." 
                      type="text" 
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="primary-gradient text-on-primary w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ambient-shadow hover:opacity-90 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5 fill-current ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
