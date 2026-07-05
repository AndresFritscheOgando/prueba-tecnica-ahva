import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { accessToken } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  if (accessToken) return <HomePage />;

  return view === 'login'
    ? <LoginPage onSwitch={() => setView('register')} />
    : <RegisterPage onSwitch={() => setView('login')} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
