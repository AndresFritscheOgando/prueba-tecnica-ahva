import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSwitch: () => void;
}

export function LoginPage({ onSwitch }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Ingresar usuario"
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresar contraseña"
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="button" variant="link" className="h-auto self-end p-0 text-sm">
              ¿Olvidó su contraseña?
            </Button>

            <Button type="submit" disabled={loading} className="w-full bg-slate-600 hover:bg-slate-700">
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿No tiene cuenta?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-blue-600 hover:underline"
              >
                Regístrese
              </button>
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="rounded-full bg-slate-100 p-2">
            <Phone className="size-4 text-slate-600" />
          </div>
          <p className="text-sm text-gray-700">
            ¿Necesita ayuda? contacte con el{' '}
            <span className="text-blue-600 hover:underline">área de soporte</span>.
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
