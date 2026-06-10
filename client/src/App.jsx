import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import MapTab from './components/MapTab.jsx';
import AutoAksyTab from './components/AutoAksyTab.jsx';
import TorgTab from './components/TorgTab.jsx';
import EventsTab from './components/EventsTab.jsx';
import ChatsTab from './components/ChatsTab.jsx';
import AuthTab from './components/AuthTab.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MapTab />} />
          <Route path="/auto-aksy" element={<AutoAksyTab />} />
          <Route path="/torg" element={<TorgTab />} />
          <Route path="/events" element={<EventsTab />} />
          <Route path="/chats" element={<ChatsTab />} />
          <Route path="/profile" element={<AuthTab />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
