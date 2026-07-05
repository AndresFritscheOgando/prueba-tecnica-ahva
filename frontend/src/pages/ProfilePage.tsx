import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, CircleHelp, Pencil, User as UserIcon, X } from 'lucide-react';
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
          <div className="flex h-10 flex-1 items-center rounded-md bg-secondary px-3 text-sm text-foreground">
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
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 w-full items-center justify-between bg-red-800 px-4 sm:px-8">
        <span className="text-sm font-medium text-white">Ahva Auth</span>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Ayuda" className="rounded-full p-1 text-white/90 hover:text-white">
            <CircleHelp className="size-6" />
          </button>
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
      <main className="flex-1 bg-gray-100 px-4 py-10 sm:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
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
            <Card>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                    <UserIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">{displayName(profile)}</p>
                    <p className="text-sm text-muted-foreground">{profile.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
