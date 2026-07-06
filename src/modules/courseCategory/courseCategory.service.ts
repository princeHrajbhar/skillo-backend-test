// src/services/courseCategory.service.ts

import CourseCategoryModel from './courseCategory.model.js';
import { CreateCourseCategoryInput, UpdateCourseCategoryInput } from './courseCategory.schema.js';

export class CourseCategoryService {
  async create(data: CreateCourseCategoryInput) {
    // Check for duplicate name or slug
    const exists = await CourseCategoryModel.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });

    if (exists) {
      throw new Error('Category name or slug already exists');
    }

    return CourseCategoryModel.create(data);
  }

  async getAll() {
    return CourseCategoryModel.find().sort({
      createdAt: -1,
    });
  }

  async getById(id: string) {
    const category = await CourseCategoryModel.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async getBySlug(slug: string) {
    const category = await CourseCategoryModel.findOne({ slug });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async update(id: string, data: UpdateCourseCategoryInput) {
    // Check if category exists
    const existingCategory = await CourseCategoryModel.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check for duplicate name or slug (excluding current category)
    if (data.name || data.slug) {
      const duplicate = await CourseCategoryModel.findOne({
        $or: [
          ...(data.name ? [{ name: data.name }] : []),
          ...(data.slug ? [{ slug: data.slug }] : []),
        ],
        _id: { $ne: id },
      });

      if (duplicate) {
        throw new Error('Category name or slug already exists');
      }
    }

    const category = await CourseCategoryModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async delete(id: string) {
    const category = await CourseCategoryModel.findById(id);

    if (!category) {
      throw new Error('Category not found');
    }

    await category.deleteOne();

    return true;
  }
}

export const courseCategoryService = new CourseCategoryService();