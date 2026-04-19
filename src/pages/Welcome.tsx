import { Link, useNavigate } from "react-router-dom";
import { Search, Image, FileText, Link2, History, Cloud, ArrowRight, User as UserIcon, MessageSquare, LayoutGrid } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { useSocket } from "../context/SocketContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { currentUser } = useSocket();

  return (
    <div className="bg-surface text-on-surface font-body h-screen overflow-hidden flex antialiased">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface ml-0 md:ml-[280px] h-full">
        {/* TopAppBar */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between flex-shrink-0 border-b border-surface-container bg-surface-container-lowest/50">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-xl text-on-background">Workspace Overview</h2>
            <p className="text-xs text-on-surface-variant font-body">Welcome back, {currentUser || 'User'}.</p>
          </div>
          
          <div className="flex items-center gap-6 hidden sm:flex">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors cursor-text" />
              <input 
                className="w-48 lg:w-64 bg-surface-container-low border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm font-body focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all text-on-background shadow-sm" 
                placeholder="Search resources" 
                type="text" 
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-surface-container cursor-pointer hover:bg-surface-container-lowest p-2 rounded-xl transition-colors">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-on-background">{currentUser || 'Guest User'}</p>
                <p className="text-[10px] text-primary font-bold tracking-wider">WORKSPACE</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant ring-2 ring-primary/10">
                {currentUser ? <span className="text-primary font-bold">{currentUser.charAt(0).toUpperCase()}</span> : <UserIcon className="w-5 h-5" />}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto pb-24 md:pb-10 custom-scrollbar relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-full auto-rows-min">
            
            <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
              {/* Priority Canvas Module */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 ambient-shadow border border-surface-container flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-lg text-on-background">Priority Canvas</h3>
                  <Link to="/media" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline group">
                    View Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant border-2 border-dashed border-surface-container rounded-2xl">
                  <LayoutGrid className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">No priority items pinned</p>
                  <p className="text-xs opacity-80 mt-1">Pin items from your Media gallery to see them here.</p>
                </div>
              </div>

              {/* Recent Conversations */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 ambient-shadow border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-lg text-on-background">Recent Conversations</h3>
                  <Link to="/messages" className="text-primary text-xs font-bold flex items-center gap-1 hover:underline group">
                    Inbox <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">No recent conversations</p>
                  <p className="text-xs opacity-80 mt-1">Start a new message to get chatting.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
              {/* Storage Used */}
              <div className="primary-gradient rounded-3xl p-6 text-on-primary ambient-shadow flex flex-col justify-between min-h-[12rem] cursor-pointer hover:shadow-lg transition-shadow group">
                <div className="flex justify-between items-start">
                  <Cloud className="text-on-primary w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] bg-white/20 font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">Standard</span>
                </div>
                <div className="mt-6">
                  <p className="text-xs text-on-primary/80 mb-1 font-medium">Workspace Storage</p>
                  <h4 className="text-2xl font-bold font-headline">0.0 GB <span className="text-sm font-normal text-on-primary/60">/ 100 GB</span></h4>
                  <div className="w-full bg-black/10 h-1.5 rounded-full mt-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="bg-white h-full rounded-full relative shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Access */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 ambient-shadow border border-surface-container flex-1">
                <h3 className="font-headline font-bold text-lg mb-4 text-on-background">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/media" className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all border border-transparent hover:border-primary/20 group">
                    <Image className="w-6 h-6 text-on-surface-variant group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                    <span className="text-xs font-bold text-on-background">Gallery</span>
                  </Link>
                  <Link to="/media" className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all border border-transparent hover:border-primary/20 group">
                    <FileText className="w-6 h-6 text-on-surface-variant group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                    <span className="text-xs font-bold text-on-background">Files</span>
                  </Link>
                  <Link to="/media" className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all border border-transparent hover:border-primary/20 group">
                    <Link2 className="w-6 h-6 text-on-surface-variant group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                    <span className="text-xs font-bold text-on-background">Links</span>
                  </Link>
                  <Link to="/notifications" className="bg-surface-container-low p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary cursor-pointer transition-all border border-transparent hover:border-primary/20 group">
                    <History className="w-6 h-6 text-on-surface-variant group-hover:text-primary group-hover:-translate-y-1 transition-all" />
                    <span className="text-xs font-bold text-on-background">Activity</span>
                  </Link>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
