import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  AppWindow, 
  PenSquare, 
  MessageSquare, 
  Compass, 
  Bell, 
  Folder, 
  UserCircle, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  X,
  Send
} from "lucide-react";
import { cn } from "../lib/utils";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && message) {
      const newThread = {
        id: Math.random().toString(),
        name: recipient,
        avatar: "",
        initial: recipient.charAt(0).toUpperCase(),
        isInitial: true,
        lastMessage: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [{
          id: Math.random().toString(),
          text: message,
          sender: 'me',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          type: 'text'
        }]
      };
      
      const savedThreads = JSON.parse(localStorage.getItem('messages_threads') || '[]');
      localStorage.setItem('messages_threads', JSON.stringify([newThread, ...savedThreads]));
      
      setShowModal(false);
      setRecipient("");
      setMessage("");
      navigate(`/messages?thread=${newThread.id}`);
    }
  };

  return (
    <>
      <nav className="fixed left-0 top-0 h-full flex flex-col p-8 space-y-6 bg-surface-container-low border-r border-surface-container w-[280px] flex-shrink-0 z-40 hidden md:flex">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden primary-gradient flex items-center justify-center shadow-lg">
            <AppWindow className="text-on-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary leading-tight">Indigo</h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant opacity-70">The Curated Canvas</p>
          </div>
        </div>
        
        {/* Primary CTA */}
        <button 
          onClick={() => setShowModal(true)}
          className="primary-gradient text-on-primary w-full py-3.5 rounded-2xl font-body font-semibold mb-8 ambient-shadow hover:opacity-95 flex items-center justify-center space-x-2"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Message</span>
        </button>
        
        {/* Main Navigation */}
        <div className="flex-grow space-y-1">
          <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Home" active={path === "/"} />
          <NavLink to="/messages" icon={<MessageSquare className="w-5 h-5" />} label="Messages" active={path.startsWith("/messages")} />
          <NavLink to="/notifications" icon={<Bell className="w-5 h-5" />} label="Updates" active={path.startsWith("/notifications")} />
          <NavLink to="/media" icon={<Folder className="w-5 h-5" />} label="Media" active={path.startsWith("/media")} />
          <NavLink to="/profile" icon={<UserCircle className="w-5 h-5 fill-current" />} label="Profile" active={path.startsWith("/profile")} />
          <NavLink to="/admin" icon={<ShieldCheck className="w-5 h-5 text-error" />} label="Admin Console" active={path.startsWith("/admin")} />
        </div>
        
        {/* Footer Navigation */}
        <div className="mt-auto space-y-1 pt-6 border-t border-outline-variant/20">
          <NavLink to="#" icon={<Settings className="w-5 h-5" />} label="Settings" active={false} />
          <NavLink to="#" icon={<HelpCircle className="w-5 h-5" />} label="Support" active={false} />
        </div>
      </nav>

      {/* New Message Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-lg shadow-2xl border border-surface-container overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
              <h3 className="font-headline font-bold text-lg text-on-background">New Message</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-background p-1 hover:bg-surface-container rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <form onSubmit={handleSendMessage} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">To:</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter name or email..." 
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-on-background"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider">Message:</label>
                <textarea 
                  placeholder="Say something nice..." 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full h-32 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none custom-scrollbar text-on-background"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={!recipient || !message}
                  className="primary-gradient text-on-primary px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, icon, label, active, badge }: { to: string, icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center px-4 py-3 rounded-xl transition-all gap-4",
        active ? "text-primary font-semibold bg-surface-container-lowest shadow-sm border border-surface-container" : "text-on-surface-variant font-medium hover:text-primary"
      )}
    >
      <span className={cn(active ? "text-primary" : "group-hover:text-primary transition-colors")}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
      {badge && (
        <span className={cn(
          "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
          active ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"
        )}>{badge}</span>
      )}
    </Link>
  );
}
