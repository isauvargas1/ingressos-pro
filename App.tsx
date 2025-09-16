import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { Layout } from './components/Layout';
import { EventDetailPage } from './components/pages/EventDetailPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/login');
    };
    window.addEventListener('hashchange', handleHashChange);
    
    // Check for logged in user (mock)
    // In a real app, this would check a token in localStorage
    api.auth.getMe().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = async (email: string) => {
    const loggedInUser = await api.auth.login(email);
    setUser(loggedInUser);
    window.location.hash = '#/';
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    window.location.hash = '#/login';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    const parts = route.replace('#', '').split('/');
    if (parts[1] === 'events' && parts[2]) {
        return <EventDetailPage eventId={parts[2]} />;
    }
    
    switch (route) {
        case '#/':
            return <DashboardPage />;
        default:
            return <DashboardPage />; // Fallback to dashboard
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
};

export default App;
