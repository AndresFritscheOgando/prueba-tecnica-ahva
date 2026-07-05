import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.string().trim().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
