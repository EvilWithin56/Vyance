import React, { useState, useEffect, useRef } from "react";
import { Camera, Cloud, User, Shield, ChevronRight, BellRing, Palette, LogOut, Check, Volume2, Globe } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { cn } from "../lib/utils";
import { useSocket } from "../context/SocketContext";
import { THEME_BASES, THEME_GRADIENTS, applyTheme } from "../lib/themes";

const lightThemes = THEME_BASES.filter(t => t.type === 'Light');

export default function Profile() {
  const { currentUser } = useSocket();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [audioNotifications, setAudioNotifications] = useState(true);
  
  const [baseThemeId, setBaseThemeId] = useState(localStorage.getItem('baseThemeId') || lightThemes[0].id);
  const [gradient, setGradient] = useState(localStorage.getItem('gradient') || THEME_GRADIENTS[0]);
  
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isGradientOpen, setIsGradientOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('baseThemeId', baseThemeId);
    localStorage.setItem('gradient', gradient);

    applyTheme(baseThemeId, gradient);
  }, [baseThemeId, gradient]);

  const requestNotifications = () => {
    if (pushNotifications) {
      setPushNotifications(false);
    } else {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') setPushNotifications(true);
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("im_pubkey_" + currentUser);
    localStorage.removeItem("im_privkey_" + currentUser);
    window.location.reload();
  };

  const selectedThemeName = lightThemes.find(t => t.id === baseThemeId)?.name || 'Default';

  return (
    <div className="bg-surface font-body text-on-surface flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface ml-0 md:ml-[280px] h-full relative">
        {/* Header */}
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between flex-shrink-0 border-b border-surface-container bg-surface-container-lowest/50 mb-0">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-xl text-on-background">Profile & Settings</h2>
            <p className="text-xs text-on-surface-variant font-body">Manage your presence and preferences.</p>
          </div>
        </header>
        
        <div className="flex-1 p-6 md:p-10 overflow-auto pb-32 md:pb-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Profile Identity Card */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-surface-container-lowest rounded-3xl p-8 ambient-shadow flex flex-col items-center text-center border border-surface-container">
                <div 
                  className="relative mb-6 group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-32 h-32 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant ring-4 ring-surface-container-lowest group-hover:opacity-60 transition-opacity">
                    {currentUser ? <span className="text-4xl text-primary font-headline uppercase">{currentUser.charAt(0)}</span> : <User className="w-16 h-16" />}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="w-8 h-8 text-white drop-shadow-md mb-1" />
                     <span className="text-[10px] text-white font-bold uppercase tracking-wider drop-shadow-md">Change Photo</span>
                  </div>
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*" />
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-on-primary ring-2 ring-surface-container-lowest hover:scale-105 transition-transform shadow-md">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-2xl font-headline font-bold text-on-background mb-1">{currentUser || 'Guest User'}</h3>
                <p className="text-on-surface-variant font-label text-sm mb-4">@{currentUser || 'guest'}</p>
                <button className="bg-surface-container-high rounded-full px-4 py-1.5 flex items-center space-x-2 mb-6 hover:bg-surface-container-highest transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs font-label font-medium text-on-surface">Available</span>
                </button>
                <div className="w-full h-px bg-outline-variant/10 mb-6"></div>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed px-2 text-balance">
                  Ready to chat securely!
                </p>
              </div>
              
              {/* Storage Info */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-container">
                <h4 className="font-headline font-semibold text-on-background mb-4 flex items-center">
                  <Cloud className="w-5 h-5 mr-3 text-primary" /> Workspace Storage
                </h4>
                <div className="w-full bg-surface-container-low rounded-full h-2 mb-3 overflow-hidden">
                  <div className="primary-gradient h-full rounded-full" style={{ width: "2%" }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-label text-on-surface-variant font-medium uppercase tracking-wider">
                  <span>10 MB used</span>
                  <span>100 GB total</span>
                </div>
              </div>
            </div>
            
            {/* Settings Sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Section */}
              <section className="bg-surface-container-lowest rounded-3xl p-3 ambient-shadow border border-surface-container">
                <h4 className="px-5 py-4 font-headline font-bold text-lg text-on-background">Account Settings</h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-headline font-semibold text-on-background mb-0.5">Personal Information</p>
                        <p className="text-xs font-label text-on-surface-variant opacity-80">Update your name, bio, and contacts</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-headline font-semibold text-on-background mb-0.5">Security & Privacy</p>
                        <p className="text-xs font-label text-on-surface-variant opacity-80">RSA-OAEP Keys, Passwords, and 2FA</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </section>
              
              {/* Notification Settings */}
              <section className="bg-surface-container-lowest rounded-3xl p-3 ambient-shadow border border-surface-container">
                <h4 className="px-5 py-4 font-headline font-bold text-lg text-on-background">Notification Settings</h4>
                <div className="space-y-1 relative">
                  
                  {/* Browser Push */}
                  <button 
                    onClick={requestNotifications}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-headline font-semibold text-on-background mb-0.5">Push Notifications</p>
                        <p className="text-xs font-label text-on-surface-variant opacity-80">OS-level alerts for background updates</p>
                      </div>
                    </div>
                    {/* Toggle switch */}
                    <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300", pushNotifications ? "bg-primary" : "bg-outline")}>
                      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm", pushNotifications ? "right-1" : "right-7")}></div>
                    </div>
                  </button>

                  {/* Audio Beep */}
                  <button 
                    onClick={() => setAudioNotifications(!audioNotifications)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-headline font-semibold text-on-background mb-0.5">Audio Notifications</p>
                        <p className="text-xs font-label text-on-surface-variant opacity-80">880Hz - 1200Hz sweep on new messages</p>
                      </div>
                    </div>
                    <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300", audioNotifications ? "bg-primary" : "bg-outline")}>
                      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm", audioNotifications ? "right-1" : "right-7")}></div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Preferences Section */}
              <section className="bg-surface-container-lowest rounded-3xl p-3 ambient-shadow border border-surface-container">
                <h4 className="px-5 py-4 font-headline font-bold text-lg text-on-background">Theme Settings</h4>
                <div className="space-y-1 relative">
                  
                  {/* Base Theme Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsThemeOpen(!isThemeOpen);
                        setIsGradientOpen(false);
                      }}
                      className={cn("w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left", isThemeOpen && "bg-surface-container-low")}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-headline font-semibold text-on-background mb-0.5">Base Theme</p>
                          <p className="text-xs font-label text-on-surface-variant opacity-80">Light color palettes</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg group-hover:bg-surface-container-high transition-colors">
                        <span className="text-sm font-medium group-hover:text-primary truncate max-w-[120px]">{selectedThemeName}</span>
                        <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:text-primary flex-shrink-0", isThemeOpen && "rotate-90")} />
                      </div>
                    </button>

                    {isThemeOpen && (
                      <div className="absolute right-4 top-full mt-2 w-64 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-20 max-h-64 overflow-y-auto custom-scrollbar animate-fade-in">
                        {lightThemes.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setBaseThemeId(theme.id);
                              setIsThemeOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
                          >
                            {theme.name}
                            {baseThemeId === theme.id && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setIsGradientOpen(!isGradientOpen);
                        setIsThemeOpen(false);
                      }}
                      className={cn("w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group text-left", isGradientOpen && "bg-surface-container-low")}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          <BellRing className="w-5 h-5 opacity-0" /> {/* Spacer */}
                          <div className="absolute w-5 h-5 rounded-md bg-gradient-to-br from-primary to-primary-container opacity-80"></div>
                        </div>
                        <div>
                          <p className="font-headline font-semibold text-on-background mb-0.5">Gradient Overlay</p>
                          <p className="text-xs font-label text-on-surface-variant opacity-80">17 workspace backgrounds</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg group-hover:bg-surface-container-high transition-colors">
                        <span className="text-sm font-medium group-hover:text-primary truncate max-w-[120px]">{gradient}</span>
                        <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:text-primary flex-shrink-0", isGradientOpen && "rotate-90")} />
                      </div>
                    </button>

                    {isGradientOpen && (
                      <div className="absolute right-4 top-full mt-2 w-64 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-10 max-h-64 overflow-y-auto custom-scrollbar animate-fade-in">
                        {THEME_GRADIENTS.map(grad => (
                          <button
                            key={grad}
                            onClick={() => {
                              setGradient(grad);
                              setIsGradientOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
                          >
                            {grad}
                            {gradient === grad && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
              
              {/* Danger Zone */}
              <section className="mt-8 pt-4 flex justify-end">
                <button onClick={handleLogout} className="text-error font-label font-medium px-6 py-3 bg-error-container/50 hover:bg-error-container rounded-2xl transition-colors flex items-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out of Indigo</span>
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
