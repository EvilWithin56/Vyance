import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { ShieldAlert, Users, Database, FileDigit, HardDrive, Trash2, Ban, Crown, Search, History, Shield, User as UserIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useSocket } from "../context/SocketContext";

export default function AdminDashboard() {
  const { send, adminStats } = useSocket();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'audit'>('stats');
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    files: 0,
    dbSize: "0 MB"
  });

  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    send({ type: "admin_stats" });
  }, [send]);

  useEffect(() => {
    if (adminStats) {
      setStats({
        users: adminStats.users || 0,
        messages: adminStats.messages || 0,
        files: adminStats.files || 0,
        dbSize: (adminStats.dbSize / (1024 * 1024)).toFixed(2) + ' MB'
      });
      setUsers(adminStats.userList || []);
      setAuditLogs(adminStats.logs || []);
    }
  }, [adminStats]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.is_admin ? 'admin' : 'user').includes(searchQuery.toLowerCase())
  );


  return (
    <div className="bg-background text-on-background font-body h-screen overflow-hidden flex antialiased">
      <Sidebar />
      <div className="ml-0 md:ml-[280px] flex-1 flex flex-col h-full bg-surface">
        <header className="h-20 px-6 sm:px-10 flex items-center justify-between flex-shrink-0 border-b border-surface-container bg-surface-container-lowest/50 shrink-0">
          <div className="flex flex-col">
            <h2 className="font-headline font-bold text-xl text-on-background flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-error" /> Admin Console
            </h2>
            <p className="text-xs text-on-surface-variant font-body">Superuser access & system telemetry (E2EE disabled for diagnostics).</p>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar pb-32">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 border-b border-surface-container mb-8">
            <button onClick={() => setActiveTab('stats')} className={cn("pb-3 text-sm font-semibold border-b-2 transition-colors", activeTab === 'stats' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface")}>System Telemetry</button>
            <button onClick={() => setActiveTab('users')} className={cn("pb-3 text-sm font-semibold border-b-2 transition-colors", activeTab === 'users' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface")}>User Management</button>
            <button onClick={() => setActiveTab('audit')} className={cn("pb-3 text-sm font-semibold border-b-2 transition-colors", activeTab === 'audit' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface")}>Audit Logs</button>
          </div>

          {/* Stats View */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
               <StatCard icon={<Users />} label="Total Registered Users" value={stats.users.toString()} trend="Active accounts" />
               <StatCard icon={<FileDigit />} label="Messages Processed" value={stats.messages.toString()} trend="In SQLite" />
               <StatCard icon={<HardDrive />} label="Database File Size" value={stats.dbSize} trend="SQLite WAL Mode" />
               <StatCard icon={<Database />} label="File Blob Storage" value={stats.files.toString()} trend="Local Disk uploads" />
            </div>
          )}

          {/* User Management View */}
          {activeTab === 'users' && (
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container ambient-shadow overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input 
                      type="text" 
                      placeholder="Search users or roles..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-container border border-surface-container-highest rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary" 
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 font-medium">User</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium">Storage</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{user.username.charAt(0).toUpperCase()}</div>
                            <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest", user.presence === 'online' ? "bg-green-500" : user.presence === 'away' ? "bg-amber-400" : "bg-outline")} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-background">{user.username}</span>
                            {user.is_admin === 1 ? (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-error-container text-on-error-container rounded text-[10px] font-bold uppercase" title="Administrator">
                                <Shield className="w-3 h-3" />
                                <span>Admin</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold uppercase" title="Standard User">
                                <UserIcon className="w-3 h-3" />
                                <span>User</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase", user.is_admin === 1 ? "bg-error-container text-on-error-container" : "bg-surface-container-high text-on-surface-variant")}>
                             {user.is_admin === 1 ? 'Admin' : 'User'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{user.last_seen || 'Never'}</td>
                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                           {user.is_admin !== 1 && (
                             <>
                              <button className="p-1.5 text-on-surface-variant hover:text-success hover:bg-success-container/30 rounded-md" title="Promote to admin"><Crown size={16}/></button>
                              <button className="p-1.5 text-on-surface-variant hover:text-amber-500 hover:bg-amber-500/10 rounded-md" title="Ban user"><Ban size={16}/></button>
                              <button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-md" title="Delete account"><Trash2 size={16}/></button>
                             </>
                           )}
                        </td>
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                          No users found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {activeTab === 'audit' && (
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container ambient-shadow p-2 animate-fade-in">
              <div className="space-y-1">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors rounded-2xl group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                         <History className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-sm text-on-background font-semibold">
                           <span className="text-primary">{log.admin}</span> performed <span className="font-mono text-xs bg-surface-container-high px-1.5 py-0.5 rounded">{log.action}</span>
                         </p>
                         <p className="text-xs text-on-surface-variant mt-0.5">Target: {log.target}</p>
                       </div>
                    </div>
                    <span className="text-xs text-on-surface-variant font-label">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container ambient-shadow flex flex-col gap-4">
       <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
         {icon}
       </div>
       <div>
         <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
         <h4 className="text-3xl font-headline font-bold text-on-background">{value}</h4>
       </div>
       <div className="text-xs font-medium text-primary mt-auto">{trend}</div>
    </div>
  );
}
