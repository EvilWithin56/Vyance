import React, { createContext, useContext } from 'react';
import { useIMSocket } from '../hooks/useIMSocket';

const SocketContext = createContext<ReturnType<typeof useIMSocket> | null>(null);

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
  return ctx;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useIMSocket();
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
