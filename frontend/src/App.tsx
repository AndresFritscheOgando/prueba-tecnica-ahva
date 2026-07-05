import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function AppContent() {
  const { accessToken } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  if (accessToken) return <ProfilePage />;

  return view === 'login'
    ? <LoginPage onSwitch={() => setView('register')} />
    : <RegisterPage onSwitch={() => setView('login')} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
