import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="auth-card">
      <h2>Welcome</h2>
      <p>You are authenticated.</p>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}
