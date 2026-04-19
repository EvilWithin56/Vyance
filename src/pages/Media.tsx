import React, { useState } from "react";
import { Search, Image as ImageIcon, Video, FileText, Link2, Play, Download, Filter, MoreHorizontal } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { cn } from "../lib/utils";

type MediaType = 'all' | 'image' | 'video' | 'document' | 'link';

interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  url?: string;
  imageUrl?: string;
  size?: string;
  duration?: string;
}

const mediaItems: MediaItem[] = [];

export default function Media() {
  const [filter, setFilter] = useState<MediaType>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-surface font-body text-on-surface flex h-screen overflow-hidden antialiased">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface ml-0 md:ml-[280px] h-screen">
        {/* TopAppBar (Mobile & Web) */}
        <header className="h-20 px-10 flex items-center justify-between flex-shrink-0 border-b border-surface-container bg-surface-container-lowest/50">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-xl text-on-background">Media Library</h2>
            <p className="text-xs text-on-surface-variant font-body">Browse your uploaded assets.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors cursor-text" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-surface-container-lowest border border-transparent rounded-xl py-2 pl-10 pr-4 text-sm font-body text-on-background focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed/30 transition-all shadow-sm" 
                placeholder="Search files..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-surface-container hidden sm:flex">
              <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-all duration-200">
                <Filter className="w-5 h-5" />
              </button>
              <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-lg transition-all duration-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Gallery & Filters Layout */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-8 pb-32 md:pb-10 custom-scrollbar">
          {/* Contextual Navigation (File Types) */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-5 py-2 rounded-full font-label text-sm transition-all duration-200", filter === 'all' ? "bg-on-surface text-surface font-semibold" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low")}
            >
              All Files
            </button>
            <button 
              onClick={() => setFilter('image')}
              className={cn("px-5 py-2 rounded-full font-label text-sm transition-all duration-200 flex items-center gap-2", filter === 'image' ? "bg-primary-fixed text-on-primary-fixed font-semibold ambient-shadow" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low")}
            >
              <ImageIcon className="w-4 h-4" />
              Images
            </button>
            <button 
              onClick={() => setFilter('video')}
              className={cn("px-5 py-2 rounded-full font-label text-sm transition-all duration-200 flex items-center gap-2", filter === 'video' ? "bg-primary-fixed text-on-primary-fixed font-semibold ambient-shadow" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low")}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
            <button 
              onClick={() => setFilter('document')}
              className={cn("px-5 py-2 rounded-full font-label text-sm transition-all duration-200 flex items-center gap-2", filter === 'document' ? "bg-primary-fixed text-on-primary-fixed font-semibold ambient-shadow" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low")}
            >
              <FileText className="w-4 h-4" />
              Documents
            </button>
            <button 
              onClick={() => setFilter('link')}
              className={cn("px-5 py-2 rounded-full font-label text-sm transition-all duration-200 flex items-center gap-2", filter === 'link' ? "bg-primary-fixed text-on-primary-fixed font-semibold ambient-shadow" : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-low")}
            >
              <Link2 className="w-4 h-4" />
              Links
            </button>
          </div>

          {/* Search Bar for Mobile only */}
          <div className="md:hidden relative group">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-transparent rounded-xl py-3 pl-10 pr-4 text-sm font-body text-on-background focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
              placeholder="Search files..." 
              type="text"
            />
          </div>

          {/* Bento Grid Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[240px]">
            {filteredItems.map(item => {
              if (item.type === 'image') {
                return (
                  <div key={item.id} className={cn("rounded-xl overflow-hidden relative group cursor-pointer ambient-shadow", item.id === "1" ? "col-span-1 sm:col-span-2 row-span-2" : "")}>
                    <img alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.imageUrl} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 lg:p-6">
                      <p className="text-white font-headline font-semibold text-sm lg:text-lg truncate">{item.title}</p>
                      {item.id === "1" && <p className="text-white/80 font-label text-sm mt-1">{item.subtitle}</p>}
                    </div>
                    {item.id === "1" && (
                      <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md rounded-full p-2 ghost-border">
                        <ImageIcon className="w-4 h-4 text-on-surface" />
                      </div>
                    )}
                  </div>
                );
              }
              
              if (item.type === 'document') {
                return (
                  <div key={item.id} className="rounded-xl bg-surface-container-lowest p-6 flex flex-col justify-between ambient-shadow hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant/10">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-headline font-semibold text-on-background mb-1 truncate">{item.title}</h3>
                      <p className="font-label text-xs text-on-surface-variant">{item.size} • {item.subtitle}</p>
                    </div>
                  </div>
                );
              }

              if (item.type === 'video') {
                return (
                  <div key={item.id} className="rounded-xl overflow-hidden relative group cursor-pointer ambient-shadow">
                    <img alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.imageUrl} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
                        <Play className="w-6 h-6 text-on-surface fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                      <span className="text-white font-label text-xs">{item.duration}</span>
                    </div>
                  </div>
                );
              }

              if (item.type === 'link') {
                return (
                  <div key={item.id} className="rounded-xl bg-surface-container-low p-6 flex flex-col justify-between ambient-shadow hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-outline-variant/20">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center flex-shrink-0 ghost-border">
                        <Link2 className="w-5 h-5 text-on-surface-variant" />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm font-semibold text-on-background line-clamp-2 leading-tight mb-2">{item.title}</h3>
                        <a className="font-label text-xs text-primary hover:underline truncate block" href={item.url}>{item.subtitle}</a>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return null;
            })}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full h-48 flex items-center justify-center flex-col text-on-surface-variant">
                <Search className="w-8 h-8 mb-4 opacity-50" />
                <p className="font-body text-sm">No items found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
