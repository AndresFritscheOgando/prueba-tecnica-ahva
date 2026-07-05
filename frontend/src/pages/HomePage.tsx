import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function HomePage() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <AuthLayout>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-foreground">Bienvenido</h2>
          <p className="text-sm text-gray-600">Ha iniciado sesión correctamente.</p>
          <Button onClick={handleLogout} className="w-full bg-slate-600 hover:bg-slate-700">
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
