import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Bell,
  Building2,
  Check,
  CircleHelp,
  FileText,
  Home,
  Menu,
  Pencil,
  Search,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, type UserProfile } from '../api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FieldKey = Exclude<keyof UserProfile, 'id' | 'username'>;

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

const TABS = ['Información básica', 'Responsabilidades', 'Historial de responsabilidades'] as const;

function displayName(profile: UserProfile): string {
  const parts = [profile.firstName, profile.paternalSurname, profile.maternalSurname].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : profile.username;
}

interface ProfileFieldProps {
  config: FieldConfig;
  value: string | null;
  editing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: (value: string) => void;
  saving: boolean;
}

function ProfileField({ config, value, editing, onStartEdit, onCancel, onSave, saving }: ProfileFieldProps) {
  const [draft, setDraft] = useState(value ?? '');

  useEffect(() => {
    if (editing) setDraft(value ?? '');
  }, [editing, value]);

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{config.label}</Label>
      {editing ? (
        <div className="flex items-center gap-1">
          <Input
            type={config.type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            disabled={saving}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Guardar"
            disabled={saving}
            onClick={() => onSave(draft)}
          >
            <Check className="size-4 text-green-700" />
          </Button>
          <Button type="button" size="icon" variant="ghost" aria-label="Cancelar" disabled={saving} onClick={onCancel}>
            <X className="size-4 text-red-700" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="flex h-10 flex-1 items-center rounded-md border border-border bg-secondary/60 px-3 text-sm text-foreground">
            {value || '—'}
          </div>
          <Button type="button" size="icon" variant="ghost" aria-label={`Editar ${config.label}`} onClick={onStartEdit}>
            <Pencil className="size-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { accessToken, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<FieldKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>(TABS[0]);

  useEffect(() => {
    if (!accessToken) return;
    authApi
      .me(accessToken)
      .then(setProfile)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSave(key: FieldKey, value: string) {
    if (!profile || !accessToken) return;
    setSaving(true);
    try {
      const updated = await authApi.updateMe(accessToken, { ...profile, [key]: value || null });
      setProfile(updated);
      setEditingKey(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

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

            {loading || !profile ? (
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
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'border-red-800 text-red-800'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === TABS[0] ? (
                  <div className="grid grid-cols-1 gap-6 px-8 py-8 sm:grid-cols-2 lg:grid-cols-3">
                    {FIELDS.map((field) => (
                      <ProfileField
                        key={field.key}
                        config={field}
                        value={profile[field.key]}
                        editing={editingKey === field.key}
                        saving={saving}
                        onStartEdit={() => setEditingKey(field.key)}
                        onCancel={() => setEditingKey(null)}
                        onSave={(value) => handleSave(field.key, value)}
                      />
                    ))}
                  </div>
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
