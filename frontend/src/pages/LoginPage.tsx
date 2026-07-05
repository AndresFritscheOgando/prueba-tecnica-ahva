import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginFormValues } from '@/lib/loginSchema';
import { useLogin } from '@/hooks/useLogin';
import { ApiError } from '@/lib/http';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSwitch: () => void;
  onLocked: (retryAfterMinutes: number) => void;
}

export function LoginPage({ onSwitch, onLocked }: Props) {
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: setSession,
      onError: (err) => {
        if (err instanceof ApiError && err.status === 403) {
          onLocked(err.retryAfterMinutes ?? 15);
          return;
        }
        toast.error(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
      },
    });
  }

  return (
    <AuthLayout>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Ingresar usuario"
                  className="pl-9"
                  aria-invalid={!!errors.username}
                  {...register('username')}
                />
              </div>
              {errors.username && <p className="text-xs text-red-700">{errors.username.message}</p>}
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
                  aria-invalid={!!errors.password}
                  {...register('password')}
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
              {errors.password && <p className="text-xs text-red-700">{errors.password.message}</p>}
            </div>

            <Button type="button" variant="link" className="h-auto self-end p-0 text-sm">
              ¿Olvidó su contraseña?
            </Button>

            <Button type="submit" disabled={loginMutation.isPending} className="w-full bg-slate-600 hover:bg-slate-700">
              {loginMutation.isPending ? 'Ingresando…' : 'Ingresar'}
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
