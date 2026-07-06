// src/modules/courseCategory/courseCategory.controller.ts

import { Request, Response } from 'express';
import { courseCategoryService } from './courseCategory.service.js';
import { createCourseCategorySchema, updateCourseCategorySchema } from './courseCategory.schema.js';

export class CourseCategoryController {
  create = async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = createCourseCategorySchema.parse(req.body);
      
      const category = await courseCategoryService.create(validatedData);

      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ✅ Fix: Prefix unused parameter with underscore
  getAll = async (_req: Request, res: Response) => {
    try {
      const categories = await courseCategoryService.getAll();

      return res.json({
        success: true,
        data: categories,
        count: categories.length,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const category = await courseCategoryService.getById(String(req.params.id));

      return res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  getBySlug = async (req: Request, res: Response) => {
    try {
      const category = await courseCategoryService.getBySlug(String(req.params.slug));

      return res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = updateCourseCategorySchema.parse(req.body);
      
      const category = await courseCategoryService.update(String(req.params.id), validatedData);

      return res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await courseCategoryService.delete(String(req.params.id));

      return res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export const courseCategoryController = new CourseCategoryController();