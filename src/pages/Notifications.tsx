import React, { useState } from "react";
import { Filter, MoreHorizontal, Inbox, AtSign, Mail, Settings2, FolderArchive, FolderOpen, Check } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { cn } from "../lib/utils";

type CategoryType = 'all' | 'mentions' | 'unread' | 'system';

interface Notification {
  id: string;
  type: CategoryType | 'file';
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  avatar?: string;
  icon?: React.ReactNode;
  category: string;
}

const initialNotifications: Notification[] = [];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const unreadCount = notifications.filter(n => n.isUnread).length;
  const mentionsCount = notifications.filter(n => n.type === 'mentions').length;
  const systemCount = notifications.filter(n => n.type === 'system').length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'unread') return n.isUnread;
    return n.type === activeCategory;
  });

  const categories = Array.from(new Set(filteredNotifications.map(n => n.category)));

  return (
    <div className="bg-surface text-on-surface font-body antialiased flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface overflow-hidden relative ml-0 md:ml-[280px]">
        {/* TopAppBar */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between flex-shrink-0 border-b border-surface-container bg-surface-container-lowest/50">
          <div className="flex flex-col">
             <h2 className="font-headline font-bold text-xl text-on-background">Notifications</h2>
             <p className="text-xs text-on-surface-variant font-body">Recent activity.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button onClick={handleMarkAllAsRead} className="hidden sm:flex text-sm text-primary font-medium hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors items-center gap-2">
              <Check className="w-4 h-4" /> Mark all read
            </button>
            <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-surface-container">
              <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <img 
                alt="User Profile" 
                className="hidden sm:block w-10 h-10 rounded-full ring-2 ring-primary/10 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVrihUPAiPJueQo_y0ELQfng__KrsKE2HwPSSihLnIm0a9deB8f6G6diSviSlw8juzAAJ6i7Rcnw85yHMCz8P4ELGcLKdPkg8uOaE6XZmOzy3DkkUYfoibPFAqrEZKsN1yGEEGpxffbojHE21EJG3XttDLe3YEbGrQTr97XHD2PQUb9wV1GtmFZ8-jsnwMNXQhUVQjrv8hMXcNhhcbtBwhyFa08aX3gciCKCP8-mRUQog3X3xuwC7iIyhArzQpV9HsB8H0teqEkyg"
              />
            </div>
          </div>
        </header>

        {/* Categories for Mobile */}
        <div className="lg:hidden flex gap-2 p-4 overflow-x-auto border-b border-surface-container hide-scrollbar bg-surface-container-low/30">
          <button onClick={() => setActiveCategory('all')} className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", activeCategory === 'all' ? "bg-on-surface text-surface" : "bg-surface-container-low text-on-surface-variant")}>All</button>
          <button onClick={() => setActiveCategory('unread')} className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", activeCategory === 'unread' ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant")}>
            Unread {unreadCount > 0 && <span className="ml-1 opacity-80">({unreadCount})</span>}
          </button>
          <button onClick={() => setActiveCategory('mentions')} className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", activeCategory === 'mentions' ? "bg-on-surface text-surface" : "bg-surface-container-low text-on-surface-variant")}>Mentions</button>
          <button onClick={() => setActiveCategory('system')} className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", activeCategory === 'system' ? "bg-on-surface text-surface" : "bg-surface-container-low text-on-surface-variant")}>System</button>
        </div>

        {/* Two Column Layout: Categories & Feed */}
        <div className="flex-1 flex overflow-hidden">
          {/* Category Sidebar (Secondary Column) */}
          <aside className="w-[280px] flex-shrink-0 bg-surface-container-low border-r border-surface-container hidden lg:flex flex-col h-full overflow-y-auto">
            <div className="p-6">
              <h3 className="font-headline font-semibold text-on-surface text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveCategory('all')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeCategory === 'all' ? "bg-surface-container-highest text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high")}>
                    <div className="flex items-center gap-3">
                      <Inbox className={cn("w-5 h-5", activeCategory === 'all' ? "text-primary" : "")} />
                      All Updates
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeCategory === 'all' ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant")}>{notifications.length}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('mentions')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeCategory === 'mentions' ? "bg-surface-container-highest text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high")}>
                    <div className="flex items-center gap-3">
                      <AtSign className={cn("w-5 h-5", activeCategory === 'mentions' ? "text-primary" : "")} />
                      Mentions
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeCategory === 'mentions' ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant")}>{mentionsCount}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('unread')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeCategory === 'unread' ? "bg-surface-container-highest text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high")}>
                    <div className="flex items-center gap-3">
                      <Mail className={cn("w-5 h-5", activeCategory === 'unread' ? "text-primary" : "")} />
                      Unread
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeCategory === 'unread' ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant")}>{unreadCount}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCategory('system')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeCategory === 'system' ? "bg-surface-container-highest text-on-surface font-semibold" : "text-on-surface-variant hover:bg-surface-container-high")}>
                    <div className="flex items-center gap-3">
                      <Settings2 className={cn("w-5 h-5", activeCategory === 'system' ? "text-primary" : "")} />
                      System
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", activeCategory === 'system' ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant")}>{systemCount}</span>
                  </button>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="font-headline font-semibold text-on-surface-variant text-sm mb-3 uppercase tracking-wider">Priority Workspaces</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">P</div>
                    <span className="text-sm font-medium text-on-surface-variant">Project Phoenix</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-xs">M</div>
                    <span className="text-sm font-medium text-on-surface-variant">Marketing Q3</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed (Third Column) */}
          <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-8">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-20 text-on-surface-variant">
                  <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-lg">No notifications found.</p>
                  <p className="text-sm opacity-80 mt-1">You're all caught up!</p>
                </div>
              ) : (
                categories.map(category => (
                  <div key={category}>
                    <h4 className="font-headline text-sm font-semibold text-on-surface-variant mb-4 sticky top-0 bg-surface/90 backdrop-blur py-2 z-10">{category}</h4>
                    <div className="space-y-3">
                      {filteredNotifications.filter(n => n.category === category).map((notification) => (
                        <div 
                          key={notification.id} 
                          onClick={(e) => {
                            if (notification.isUnread) handleMarkAsRead(notification.id, e);
                          }}
                          className={cn(
                          "group relative p-4 sm:p-5 rounded-xl border transition-all cursor-pointer",
                          notification.isUnread 
                            ? "bg-surface-container-lowest shadow-sm border-outline-variant/15 hover:border-primary/30" 
                            : "bg-surface-container border-transparent opacity-80 hover:opacity-100"
                        )}>
                          {notification.isUnread && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
                          )}
                          <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                              {notification.avatar ? (
                                <img 
                                  alt="Avatar" 
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-surface-container-lowest" 
                                  src={notification.avatar}
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container ring-2 ring-surface-container-lowest">
                                  {notification.icon}
                                </div>
                              )}
                              {notification.type === 'mentions' && notification.avatar && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-on-primary rounded-full flex items-center justify-center ring-2 ring-surface-container-lowest">
                                  <AtSign className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                <h5 className={cn("text-sm sm:text-base truncate", notification.isUnread ? "font-semibold text-on-surface" : "font-medium text-on-surface")}>
                                  {notification.title}
                                </h5>
                                <span className={cn("text-[10px] sm:text-xs ml-2 flex-shrink-0", notification.isUnread ? "font-medium text-primary" : "text-on-surface-variant")}>
                                  {notification.time}
                                </span>
                              </div>
                              <p className={cn("text-xs sm:text-sm line-clamp-2 mb-3", notification.isUnread ? "text-on-surface-variant font-medium" : "text-on-surface-variant")}>
                                {notification.description}
                              </p>
                              {notification.isUnread && (
                                <div className="flex gap-2">
                                  {notification.type === 'mentions' && (
                                    <button className="px-3 py-1.5 sm:px-4 bg-primary/10 hover:bg-primary/20 text-primary text-xs sm:text-sm font-medium rounded-lg transition-colors">View thread</button>
                                  )}
                                  {notification.type === 'file' && (
                                    <button className="px-3 py-1.5 sm:px-4 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-medium rounded-lg transition-colors">View files</button>
                                  )}
                                  <button onClick={(e) => handleMarkAsRead(notification.id, e)} className="px-3 py-1.5 sm:px-4 text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs sm:text-sm font-medium rounded-lg transition-colors">Mark read</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Bottom spacer for scrolling */}
            <div className="h-24 md:h-10"></div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
