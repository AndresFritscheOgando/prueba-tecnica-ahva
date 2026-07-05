import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterFormValues } from '@/lib/schemas/registerSchema';
import { useRegister } from '@/hooks/useRegister';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  onSwitch: () => void;
}

export function RegisterPage({ onSwitch }: Props) {
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      username: '', 
      email: '', 
      password: '' 
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onSuccess: setSession,
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'No se pudo completar el registro');
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
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresar correo"
                  className="pl-9"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-700">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresar contraseña (8+)"
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

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-slate-600 hover:bg-slate-700"
            >
              {registerMutation.isPending ? 'Creando…' : 'Crear cuenta'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tiene cuenta?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-blue-600 hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
