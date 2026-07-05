import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  secondsLeft: number;
  onExtend: () => void;
}

export function IdleSessionWarningModal({ secondsLeft, onExtend }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-amber-100 p-4">
            <AlertTriangle className="size-8 text-amber-500" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Su sesión está a punto de expirar</h1>
          <p className="text-sm text-gray-600">
            Por seguridad, su sesión expirará en {secondsLeft} segundos. Para continuar, seleccione
            "Extender sesión"
          </p>
          <Button onClick={onExtend} className="mt-2 w-full bg-amber-500 hover:bg-amber-600">
            Extender sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
