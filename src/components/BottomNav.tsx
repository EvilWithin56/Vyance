import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Bell, UserCircle, LayoutDashboard, Image } from "lucide-react";
import React from 'react';
import { cn } from "../lib/utils";

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest h-16 flex justify-around items-center z-40 border-t border-outline-variant/10 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <NavItem to="/" icon={<LayoutDashboard className="w-6 h-6" />} label="Home" active={path === "/"} />
      <NavItem to="/messages" icon={<MessageSquare className={cn("w-6 h-6", path.startsWith("/messages") && "fill-current")} />} label="Messages" active={path.startsWith("/messages")} />
      <NavItem to="/media" icon={<Image className="w-6 h-6" />} label="Media" active={path.startsWith("/media")} />
      <NavItem to="/notifications" icon={<Bell className={cn("w-6 h-6", path.startsWith("/notifications") && "fill-current")} />} label="Updates" active={path.startsWith("/notifications")} />
      <NavItem to="/profile" icon={<UserCircle className={cn("w-6 h-6", path.startsWith("/profile") && "fill-current")} />} label="Profile" active={path.startsWith("/profile")} />
    </nav>
  );
}

function NavItem({ to, icon, label, active, badge }: { to: string, icon: React.ReactNode, label: string, active?: boolean, badge?: boolean }) {
  return (
    <Link to={to} className={cn("flex flex-col items-center justify-center w-full h-full relative", active ? "text-primary" : "text-on-surface-variant")}>
      {icon}
      <span className={cn("text-[10px] mt-1", active ? "font-semibold" : "font-medium")}>{label}</span>
      {badge && (
        <div className="absolute top-2 right-[25%] lg:right-[35%] w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></div>
      )}
    </Link>
  );
}
