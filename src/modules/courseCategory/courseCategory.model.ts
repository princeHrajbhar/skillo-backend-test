// src/models/course-category.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourseCategory extends Document {
  name: string;
  slug: string;
  description?: string;
}

const CourseCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// Add indexes for other fields if needed
// ✅ Index for sorting by creation date (useful for listing)
CourseCategorySchema.index({ createdAt: -1 });

// ✅ Compound index for name and description search (if you need text search)
// CourseCategorySchema.index({ name: 'text', description: 'text' });

const CourseCategoryModel: Model<ICourseCategory> =
  mongoose.models.CourseCategory || mongoose.model<ICourseCategory>('CourseCategory', CourseCategorySchema);

export default CourseCategoryModel;