import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AccountLockedPage } from './pages/AccountLockedPage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function AppContent() {
  const { accessToken } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'locked'>('login');
  const [retryAfterMinutes, setRetryAfterMinutes] = useState(15);

  if (accessToken) return <ProfilePage />;

  if (view === 'locked') {
    return <AccountLockedPage retryAfterMinutes={retryAfterMinutes} onBack={() => setView('login')} />;
  }

  return view === 'login'
    ? (
      <LoginPage
        onSwitch={() => setView('register')}
        onLocked={(mins) => {
          setRetryAfterMinutes(mins);
          setView('locked');
        }}
      />
    )
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
