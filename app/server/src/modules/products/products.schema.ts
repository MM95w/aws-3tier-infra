import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1).max(40),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  categoryId: z.number().int().positive().optional(),
  supplierId: z.number().int().positive().optional(),
  unitPrice: z.number().nonnegative(),
  costPrice: z.number().nonnegative(),
  quantityInStock: z.number().int().nonnegative().default(0),
  reorderLevel: z.number().int().nonnegative().default(10),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuery = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  sort: z.enum(['name', 'unitPrice', 'quantityInStock', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuery>;
