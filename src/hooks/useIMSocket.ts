import { useState, useEffect, useRef, useCallback } from 'react';

// For E2EE Crypto
async function generateAndExportKeys(username: string) {
  const keyPair = await window.crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"]
  );
  const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
  
  localStorage.setItem(`im_pubkey_${username}`, JSON.stringify(pubJwk));
  localStorage.setItem(`im_privkey_${username}`, JSON.stringify(privJwk));
  
  return { pubJwk, privJwk, keyPair };
}

export function useIMSocket() {
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Minimal Reactive State
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) return;

    // We assume the WS endpoint is on the same host, path /ws
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setConnected(true);
      setAuthError(null);
    };

    ws.onmessage = async (e) => {
      const packet = JSON.parse(e.data);
      switch(packet.type) {
        case 'login_ok':
          setCurrentUser(packet.username);
          break;
        case 'login_error':
          setAuthError(packet.body);
          break;
        case 'chat':
          const target = packet.recipient === 'ALL' ? 'ALL' : (packet.sender === currentUser ? packet.recipient : packet.sender);
          setMessages(prev => ({
            ...prev,
            [target]: [...(prev[target] || []), packet]
          }));
          break;
        case 'history':
          setMessages(prev => ({
            ...prev,
            [packet.contact]: packet.messages
          }));
          break;
        case 'admin_stats':
          setAdminStats(packet);
          break;
        case 'status':
          // Update status of specific messages
          break;
        // system, userlist, etc.
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 3000); // basic backoff
    };

    wsRef.current = ws;
  }, [currentUser]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const send = (packet: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(packet));
    }
  };

  const login = (username: string, password: string) => send({ type: 'login', username, password });
  const signup = (username: string, password: string) => send({ type: 'signup', username, password });
  const sendMessage = (recipient: string, body: string, reply_to?: string) => send({ type: 'chat', recipient, body, reply_to });

  return {
    connected,
    currentUser,
    authError,
    messages,
    users,
    adminStats,
    send,
    login,
    signup,
    sendMessage
  };
}
