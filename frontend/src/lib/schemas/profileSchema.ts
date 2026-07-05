import { z } from 'zod';

export const profileSchema = z.object({
  email: z.string().trim().min(1, 'El correo es obligatorio').max(256).email('Correo electrónico inválido'),

  firstName: z.string().max(150, 'Nombres: máximo 150 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  paternalSurname: z.string().max(100, 'Primer apellido: máximo 100 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  maternalSurname: z.string().max(100, 'Segundo apellido: máximo 100 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  documentType: z.string().max(20, 'Tipo de documento: máximo 20 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  documentNumber: z.string().max(20, 'N° de documento: máximo 20 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  birthDate: z.string()
    .refine((v) => v.trim() === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Fecha inválida' })
    .transform((v) => (v.trim() === '' ? null : v)),

  nationality: z.string().max(100, 'Nacionalidad: máximo 100 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  sex: z.string().max(20, 'Sexo: máximo 20 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  secondaryEmail: z.string().max(256, 'Correo secundario: máximo 256 caracteres')
    .refine((v) => v.trim() === '' || z.string().email().safeParse(v).success, { message: 'Correo electrónico inválido' })
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  mobilePhone: z.string().max(20, 'Teléfono móvil: máximo 20 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  secondaryPhone: z.string().max(20, 'Teléfono secundario: máximo 20 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  contractType: z.string().max(50, 'Tipo de contratación: máximo 50 caracteres')
    .transform((v) => (v.trim() === '' ? null : v.trim())),

  contractDate: z.string()
    .refine((v) => v.trim() === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: 'Fecha inválida' })
    .transform((v) => (v.trim() === '' ? null : v)),
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileFormOutput = z.output<typeof profileSchema>;
