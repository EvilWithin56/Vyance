/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Media from "./pages/Media";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import { SocketProvider, useSocket } from "./context/SocketContext";

function MainApp() {
  const { currentUser, login, signup, authError, connected } = useSocket();

  if (!currentUser) {
    return <Auth onLogin={login} onSignup={signup} authError={authError} connected={connected} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/media" element={<Media />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <SocketProvider>
      <MainApp />
    </SocketProvider>
  );
}
