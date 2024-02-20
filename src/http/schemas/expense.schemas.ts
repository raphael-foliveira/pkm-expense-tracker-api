import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  price: z.number().positive('O preço deve ser um valor positivo'),
  description: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres'),
  date: z.coerce
    .date()
    .max(new Date(), 'A data deve ser menor ou igual a data atual'),
});

export const UpdateExpenseSchema = z.object({
  price: z.number().positive('O preço deve ser um valor positivo').optional(),
  description: z
    .string()
    .min(5, 'A descrição deve ter no mínimo 5 caracteres')
    .optional(),
  date: z
    .date()
    .max(new Date(), 'A data deve ser menor ou igual a data atual')
    .optional(),
});

export const GetByMonthSchema = z.object({
  month: z.coerce
    .number()
    .min(1, 'O mês deve ser um valor entre 1 e 12')
    .max(12, 'O mês deve ser um valor entre 1 e 12'),
  year: z.coerce.number(),
});
