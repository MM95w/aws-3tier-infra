import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { HttpError } from '../../utils/httpError';
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from './products.schema';

export const productsService = {
  async list(q: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(q.categoryId ? { categoryId: q.categoryId } : {}),
      ...(q.search
        ? {
            OR: [
              { name: { contains: q.search, mode: 'insensitive' } },
              { sku: { contains: q.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { [q.sort]: q.order },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
        include: { category: true, supplier: true },
      }),
    ]);

    return {
      data: items,
      pagination: { page: q.page, limit: q.limit, total, totalPages: Math.ceil(total / q.limit) },
    };
  },

  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, supplier: true },
    });
    if (!product) throw HttpError.notFound('Product not found');
    return product;
  },

  async create(input: CreateProductInput) {
    const exists = await prisma.product.findUnique({ where: { sku: input.sku } });
    if (exists) throw HttpError.conflict('SKU_TAKEN', 'A product with this SKU already exists');
    return prisma.product.create({ data: input });
  },

  async update(id: number, input: UpdateProductInput) {
    await this.getById(id); // 404 if missing
    return prisma.product.update({ where: { id }, data: input });
  },

  /** Soft delete — preserves order history that references the product. */
  async remove(id: number) {
    await this.getById(id);
    await prisma.product.update({ where: { id }, data: { isActive: false } });
  },

  async lowStock() {
    // Items at or below their reorder level (raw SQL: column-to-column comparison).
    return prisma.$queryRaw`
      SELECT id, sku, name, quantity_in_stock AS "quantityInStock", reorder_level AS "reorderLevel"
      FROM products
      WHERE is_active = true AND quantity_in_stock <= reorder_level
      ORDER BY quantity_in_stock ASC`;
  },
};
