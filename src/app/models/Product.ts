import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String, unique: true },
  description: { type: String },
  images: [{ type: String }],
  navbarCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NavbarCategory',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  features: [{ type: String }],
  specifications: { type: Map, of: String },
  catalogPdf: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ navbarCategoryId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ subcategoryId: 1 });

// Virtual population
ProductSchema.virtual('navbarCategory', {
  ref: 'NavbarCategory',
  localField: 'navbarCategoryId',
  foreignField: '_id',
  justOne: true
});

ProductSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

ProductSchema.virtual('subcategory', {
  ref: 'Subcategory',
  localField: 'subcategoryId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 