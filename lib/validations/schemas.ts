import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rut: z.string().optional()
})

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Categoría requerida'),
  description: z.string().optional(),
  memberId: z.string().optional().nullable(),
  date: z.string().optional()
})

export const memberSchema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  rut: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  profession: z.string().optional(),
  maritalStatus: z.string().optional(),
  status: z.enum(['ACTIVE', 'PASSIVE', 'DISCIPLINE']).optional()
})

export const assetSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  category: z.string().min(1, 'Categoría requerida'),
  cost: z.coerce.number().min(0, 'El costo no puede ser negativo').optional(),
  currentValue: z.coerce.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'DAMAGED', 'LOST', 'SOLD', 'DISCARDED'])
})
