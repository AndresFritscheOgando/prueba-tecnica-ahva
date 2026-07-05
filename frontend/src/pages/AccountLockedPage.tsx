import { Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  retryAfterMinutes: number;
  onBack: () => void;
}

export function AccountLockedPage({ retryAfterMinutes, onBack }: Props) {
  return (
    <AuthLayout>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-blue-100 p-4">
            <Lock className="size-8 text-blue-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Cuenta bloqueada temporalmente</h1>
          <p className="text-sm text-gray-600">
            Has excedido el número máximo de intentos fallidos (3). Por seguridad, tu cuenta ha
            sido bloqueada durante {retryAfterMinutes} minuto(s). Intenta nuevamente más tarde.
          </p>
          <Button onClick={onBack} className="mt-2 w-full bg-slate-600 hover:bg-slate-700">
            Volver al inicio de sesión
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
