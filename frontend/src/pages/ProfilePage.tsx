import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm, type FieldError, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bell,
  Building2,
  CircleHelp,
  FileText,
  Home,
  Menu,
  Search,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserProfile } from '../api/auth';
import { profileSchema, type ProfileFormOutput, type ProfileFormValues } from '@/lib/profileSchema';
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FieldKey = keyof ProfileFormValues;
type ActiveTab = 'basic' | 'responsibilities' | 'history';

interface FieldConfig {
  key: FieldKey;
  label: string;
  type: 'text' | 'date';
}

const FIELDS: FieldConfig[] = [
  { key: 'firstName', label: 'Nombres', type: 'text' },
  { key: 'paternalSurname', label: 'Primer Apellido', type: 'text' },
  { key: 'maternalSurname', label: 'Segundo Apellido', type: 'text' },
  { key: 'documentType', label: 'Tipo de Documento de Identidad', type: 'text' },
  { key: 'documentNumber', label: 'N° de Documento de Identidad', type: 'text' },
  { key: 'birthDate', label: 'Fecha de nacimiento', type: 'date' },
  { key: 'nationality', label: 'Nacionalidad', type: 'text' },
  { key: 'sex', label: 'Sexo', type: 'text' },
  { key: 'email', label: 'Correo electrónico principal', type: 'text' },
  { key: 'secondaryEmail', label: 'Correo electrónico secundario (Opcional)', type: 'text' },
  { key: 'mobilePhone', label: 'Teléfono Móvil', type: 'text' },
  { key: 'secondaryPhone', label: 'Teléfono secundario (Opcional)', type: 'text' },
  { key: 'contractType', label: 'Tipo de Contratación', type: 'text' },
  { key: 'contractDate', label: 'Fecha de contratación', type: 'date' },
];

const emptyFormValues: ProfileFormValues = {
  email: '',
  firstName: '',
  paternalSurname: '',
  maternalSurname: '',
  documentType: '',
  documentNumber: '',
  birthDate: '',
  nationality: '',
  sex: '',
  secondaryEmail: '',
  mobilePhone: '',
  secondaryPhone: '',
  contractType: '',
  contractDate: '',
};

function toFormValues(profile: UserProfile): ProfileFormValues {
  return {
    email: profile.email,
    firstName: profile.firstName ?? '',
    paternalSurname: profile.paternalSurname ?? '',
    maternalSurname: profile.maternalSurname ?? '',
    documentType: profile.documentType ?? '',
    documentNumber: profile.documentNumber ?? '',
    birthDate: profile.birthDate ?? '',
    nationality: profile.nationality ?? '',
    sex: profile.sex ?? '',
    secondaryEmail: profile.secondaryEmail ?? '',
    mobilePhone: profile.mobilePhone ?? '',
    secondaryPhone: profile.secondaryPhone ?? '',
    contractType: profile.contractType ?? '',
    contractDate: profile.contractDate ?? '',
  };
}

function displayName(profile: UserProfile): string {
  const parts = [profile.firstName, profile.paternalSurname, profile.maternalSurname].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : profile.username;
}

function FormField({
  config,
  register,
  error,
}: {
  config: FieldConfig;
  register: UseFormRegister<ProfileFormValues>;
  error?: FieldError;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={config.key} className="text-xs text-muted-foreground">
        {config.label}
      </Label>
      <Input id={config.key} type={config.type} aria-invalid={!!error} {...register(config.key)} />
      {error && <p className="text-xs text-red-700">{error.message}</p>}
    </div>
  );
}

export function ProfilePage() {
  const { accessToken, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('basic');

  const profileQuery = useProfileQuery(accessToken);
  const updateMutation = useUpdateProfileMutation(accessToken);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (profileQuery.data) reset(toFormValues(profileQuery.data));
  }, [profileQuery.data, reset]);

  useEffect(() => {
    if (profileQuery.error) {
      toast.error(profileQuery.error instanceof Error ? profileQuery.error.message : 'Failed to load profile');
    }
  }, [profileQuery.error]);

  function onSubmit(values: ProfileFormOutput) {
    updateMutation.mutate(
      { ...values, secondaryPhoneType: profileQuery.data?.secondaryPhoneType ?? null },
      {
        onSuccess: () => toast.success('Perfil actualizado correctamente'),
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update profile'),
      },
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="flex min-h-svh">
      <aside className="flex w-16 flex-col items-center gap-2 border-r border-border bg-white py-4">
        <button type="button" aria-label="Menú" className="rounded-md p-2 text-muted-foreground hover:bg-secondary">
          <Menu className="size-5" />
        </button>
        <button type="button" aria-label="Inicio" className="rounded-md p-2 text-muted-foreground hover:bg-secondary">
          <Home className="size-5" />
        </button>
        <button type="button" aria-label="Institución" className="rounded-md p-2 text-muted-foreground hover:bg-secondary">
          <Building2 className="size-5" />
        </button>
        <button type="button" aria-label="Perfil" className="rounded-md bg-red-100 p-2 text-red-800">
          <FileText className="size-5" />
        </button>
        <button type="button" aria-label="Buscar" className="rounded-md p-2 text-muted-foreground hover:bg-secondary">
          <Search className="size-5" />
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 w-full items-center justify-end bg-red-800 px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button type="button" aria-label="Ayuda" className="rounded-full p-1 text-white/90 hover:text-white">
              <CircleHelp className="size-6" />
            </button>
            <button type="button" aria-label="Notificaciones" className="relative rounded-full p-1 text-white/90 hover:text-white">
              <Bell className="size-6" />
              <span className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-[10px] font-semibold text-red-800">
                9+
              </span>
            </button>
            {profile && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                  <UserIcon className="size-4 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-white">{displayName(profile)}</p>
                  <p className="text-xs text-white/70">Operador</p>
                </div>
              </div>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={() => logout()}
            >
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 px-4 py-10 sm:px-8">
          <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Perfil de usuario</p>
              <h1 className="text-2xl font-semibold text-foreground">Perfil de usuario</h1>
            </div>

            {profileQuery.isLoading || !profile ? (
              <Card>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Cargando perfil…</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden py-0">
                <div className="flex items-center gap-4 border-b border-border px-8 py-6">
                  <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                    <UserIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-medium text-foreground">{displayName(profile)}</p>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Activo
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.username}</p>
                  </div>
                </div>

                <div className="flex gap-8 border-b border-border px-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'basic'
                        ? 'border-red-800 text-red-800'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Información básica
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('responsibilities')}
                    className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'responsibilities'
                        ? 'border-red-800 text-red-800'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Responsabilidades
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'history'
                        ? 'border-red-800 text-red-800'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Historial de responsabilidades
                  </button>
                </div>

                {activeTab === 'basic' ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-6 px-8 py-8 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {FIELDS.map((field) => (
                      <FormField key={field.key} config={field} register={register} error={errors[field.key]} />
                    ))}
                    <div className="col-span-full flex justify-end">
                      <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="px-8 py-16 text-center text-sm text-muted-foreground">
                    Sin información disponible.
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
