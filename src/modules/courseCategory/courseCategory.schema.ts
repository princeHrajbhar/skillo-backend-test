// src/schemas/courseCategory.schema.ts

import { z } from 'zod';

export const createCourseCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateCourseCategorySchema = createCourseCategorySchema.partial();

export type CreateCourseCategoryInput = z.infer<typeof createCourseCategorySchema>;
export type UpdateCourseCategoryInput = z.infer<typeof updateCourseCategorySchema>;